from nbformat.v4 import new_code_cell, new_markdown_cell
import re


# Helper: Map Deepnote block type to Jupyter cell type
def map_block_type_to_jupyter(btype: str) -> str:
    # Mirror convertCellTypeToJupyter from utils.ts
    code_types = {
        "big-number",
        "code",
        "sql",
        # "notebook-function",  # notebook-function is no longer a code type
        "input-text",
        "input-checkbox",
        "input-textarea",
        "input-file",
        "input-select",
        "input-date-range",
        "input-date",
        "input-slider",
        "visualization",
    }
    markdown_types = {
        "markdown",
        "text-cell-h1",
        "text-cell-h2",
        "text-cell-h3",
        "text-cell-p",
        "text-cell-bullet",
        "text-cell-todo",
        "text-cell-callout",
        "image",
        "button",
        "separator",
        "notebook-function",  # treat notebook-function as markdown
    }
    if btype in code_types:
        return "code"
    elif btype in markdown_types:
        return "markdown"
    else:
        return "markdown"


# Helper: Sanitize a string to a valid Python variable name (mirrors TS sanitizePythonVariableName)
def sanitize_python_variable_name(
    name: str, disable_empty_fallback: bool = False
) -> str:
    # Replace whitespace with underscores
    sanitized = re.sub(r"\s+", "_", name)
    # Remove invalid characters
    sanitized = re.sub(r"[^0-9a-zA-Z_]", "", sanitized)
    # Remove invalid leading characters
    sanitized = re.sub(r"^[^a-zA-Z_]+", "", sanitized)
    if sanitized == "" and not disable_empty_fallback:
        sanitized = "input_1"
    return sanitized


# Helper: Escape a string for safe use as a Python string literal (mirrors TS escapePythonString)
def escape_python_string(value) -> str:
    # Ensure value is always a string
    if not isinstance(value, str):
        value = str(value)
    # Escape backslashes, single quotes, and newlines, then wrap in single quotes
    escaped = value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"'{escaped}'"


# Helper: Helper for big-number cell
def execute_big_number(
    title_template: str,
    value_variable_name: str,
    comparison_title_template: str = "",
    comparison_variable_name: str = "",
) -> str:
    value_part = f'f"{{{value_variable_name}}}"' if value_variable_name else '""'
    comparison_value_part = (
        f'f"{{{comparison_variable_name}}}"' if comparison_variable_name else '""'
    )
    # Use triple-quoted string for multiline Python code
    return f"""
def __deepnote_big_number__():
    import json
    import jinja2
    from jinja2 import meta

    def render_template(template):
        parsed_content = jinja2.Environment().parse(template)

        required_variables = meta.find_undeclared_variables(parsed_content)

        context = {{
            variable_name: globals().get(variable_name)
            for variable_name in required_variables
        }}

        result = jinja2.Environment().from_string(template).render(context)

        return result

    rendered_title = render_template("{title_template}")
    rendered_comparison_title = render_template("{comparison_title_template}")

    return json.dumps({{
        "comparisonTitle": rendered_comparison_title,
        "comparisonValue": {comparison_value_part},
        "title": rendered_title,
        "value": {value_part}
    }})

__deepnote_big_number__()
""".lstrip()


# Helper: Execute SQL query (Python code generator, mirrors TS executeSqlQuery)
def execute_sql_query(
    query: str,
    connection_env_var: str,
    python_variable_name: str | None,
    sql_cache_mode: str,
    return_variable_type: str,
) -> str:
    # Escape query and audit comment for Python string literal
    def escape_python_string(value: str) -> str:
        # Escape backslashes, single quotes, and newlines, then wrap in single quotes
        escaped = value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
        return f"'{escaped}'"

    escaped_query = escape_python_string(query)
    escaped_audit_comment = "''"  # No audit comment in this context
    connection_env_var_str = connection_env_var or ""
    # Build the function call
    execute_sql_code = (
        f"_dntk.execute_sql(\n"
        f"  {escaped_query},\n"
        f"  '{connection_env_var_str}',\n"
        f"  audit_sql_comment={escaped_audit_comment},\n"
        f"  sql_cache_mode='{sql_cache_mode}',\n"
        f"  return_variable_type='{return_variable_type}'\n"
        f")"
    )
    if python_variable_name:
        return f"{python_variable_name} = {execute_sql_code}\n{python_variable_name}"
    else:
        return execute_sql_code


# --- Date range input helpers ---


def is_valid_absolute_date_range(value):
    # Accepts [start, end] where both are strings or empty string
    if not isinstance(value, (list, tuple)):
        return False
    if len(value) != 2:
        return False
    s, e = value

    # Accepts empty string or ISO date string
    def is_date_or_empty(x):
        return x == "" or (isinstance(x, str) and re.match(r"^\d{4}-\d{2}-\d{2}", x))

    return is_date_or_empty(s) and is_date_or_empty(e)


def is_custom_date_range(value):
    # Accepts string like "customDays14"
    if not isinstance(value, str):
        return False
    return value.startswith("customDays") and value[10:].isdigit()


def is_valid_relative_date_interval(value):
    # Accepts one of the known keys
    if not isinstance(value, str):
        return value in []
    return value in DATE_RANGE_INPUT_RELATIVE_RANGES


def date_range_absolute(name, start_date, end_date):
    # Both start_date and end_date are strings, may be empty
    code = []
    code.append("from dateutil.parser import parse as _deepnote_parse")
    sd = f"_deepnote_parse('{start_date}').date()" if start_date else "None"
    ed = f"_deepnote_parse('{end_date}').date()" if end_date else "None"
    code.append(f"{name} = [{sd}, {ed}]")
    return "\n".join(code)


def date_range_custom_days(name, days):
    return (
        "from datetime import datetime, timedelta\n"
        f"{name} = [datetime.now().date() - timedelta(days={days}), datetime.now().date()]"
    )


def date_range_past7days(name):
    return (
        "from datetime import datetime as _deepnote_datetime, timedelta as _deepnote_timedelta\n"
        f"{name} = [_deepnote_datetime.now().date() - _deepnote_timedelta(days=7), _deepnote_datetime.now().date()]"
    )


def date_range_past14days(name):
    return (
        "from datetime import datetime as _deepnote_datetime, timedelta as _deepnote_timedelta\n"
        f"{name} = [_deepnote_datetime.now().date() - _deepnote_timedelta(days=14), _deepnote_datetime.now().date()]"
    )


def date_range_pastMonth(name):
    return (
        "from datetime import datetime as _deepnote_datetime\n"
        "from dateutil.relativedelta import relativedelta\n"
        f"{name} = [_deepnote_datetime.now().date() - relativedelta(months=1), _deepnote_datetime.now().date()]"
    )


def date_range_past3months(name):
    return (
        "from datetime import datetime as _deepnote_datetime\n"
        "from dateutil.relativedelta import relativedelta\n"
        f"{name} = [_deepnote_datetime.now().date() - relativedelta(months=3), _deepnote_datetime.now().date()]"
    )


def date_range_past6months(name):
    return (
        "from datetime import datetime as _deepnote_datetime\n"
        "from dateutil.relativedelta import relativedelta\n"
        f"{name} = [_deepnote_datetime.now().date() - relativedelta(months=6), _deepnote_datetime.now().date()]"
    )


def date_range_pastYear(name):
    return (
        "from datetime import datetime as _deepnote_datetime\n"
        "from dateutil.relativedelta import relativedelta\n"
        f"{name} = [_deepnote_datetime.now().date() - relativedelta(years=1), _deepnote_datetime.now().date()]"
    )


DATE_RANGE_INPUT_RELATIVE_RANGES = {
    "past7days": date_range_past7days,
    "past14days": date_range_past14days,
    "pastMonth": date_range_pastMonth,
    "past3months": date_range_past3months,
    "past6months": date_range_past6months,
    "pastYear": date_range_pastYear,
}


# Helper: Map Deepnote block source (content) for Jupyter
def map_block_source(btype: str, content: str, metadata: dict) -> str:
    # Handle all text-cell-* types and separator, else return content unchanged
    if btype == "text-cell-h1":
        return "# " + content
    elif btype == "text-cell-h2":
        return "## " + content
    elif btype == "text-cell-h3":
        return "### " + content
    elif btype == "text-cell-bullet":
        return "- " + content
    elif btype == "text-cell-todo":
        checked = metadata.get("checked", False)
        return "- [x] " + content if checked else "- [ ] " + content
    elif btype == "text-cell-callout":
        return "> " + content
    elif btype == "separator":
        return "<hr>"
    elif btype == "input-text" or btype == "input-textarea" or btype == "input-slider":
        # Generate Python assignment: {sanitized_variable_name} = {escaped_value}
        var_name = sanitize_python_variable_name(
            metadata.get("deepnote_variable_name", "")
        )
        value = escape_python_string(metadata.get("deepnote_variable_value", ""))
        return f"{var_name} = {value}"
    elif btype == "input-checkbox":
        # Sanitize variable name and assign True/False based on value
        var_name = sanitize_python_variable_name(
            metadata.get("deepnote_variable_name", "")
        )
        value = metadata.get("deepnote_variable_value")
        return f"{var_name} = {'True' if value else 'False'}"
    elif btype == "input-select":
        var_name = sanitize_python_variable_name(
            metadata.get("deepnote_variable_name", "")
        )
        allow_multiple = metadata.get("deepnote_allow_multiple_values")
        values = metadata.get("deepnote_variable_value", None)
        # If allow_multiple is truthy or values is a list, treat as list assignment
        if allow_multiple or isinstance(values, list):
            # Ensure values is a list
            if not isinstance(values, list):
                values = [values] if values is not None else []
            return (
                f"{var_name} = [{', '.join(escape_python_string(v) for v in values)}]"
            )
        # If not allow_multiple and value is falsy (None or empty string), assign None
        elif not allow_multiple and (values is None or values == ""):
            return f"{var_name} = None"
        else:
            # Explicitly convert to string for type safety
            return f"{var_name} = {escape_python_string(str(values or ''))}"
    elif btype == "input-date":
        var_name = sanitize_python_variable_name(
            metadata.get("deepnote_variable_name", "")
        )
        escaped_value = escape_python_string(
            metadata.get("deepnote_variable_value", "")
        )
        if not metadata.get("deepnote_variable_value"):
            return f"{var_name} = None"
        elif metadata.get("deepnote_input_date_version") == 2:
            return (
                f"from dateutil.parser import parse as _deepnote_parse\n"
                f"{var_name} = _deepnote_parse({escaped_value}).date()"
            )
        else:
            return (
                f"from datetime import datetime as _deepnote_datetime\n"
                f'{var_name} = _deepnote_datetime.strptime({escaped_value}, "%Y-%m-%dT%H:%M:%S.%fZ")'
            )
    elif btype == "input-date-range":
        var_name = sanitize_python_variable_name(
            metadata.get("deepnote_variable_name", "")
        )
        value = metadata.get("deepnote_variable_value", None)
        # Absolute date range: [start, end]
        if isinstance(value, (list, tuple)) and is_valid_absolute_date_range(value):
            start, end = value
            return date_range_absolute(var_name, start, end)
        # Custom days: "customDaysN"
        elif isinstance(value, str) and is_custom_date_range(value):
            try:
                days = int(str(value)[10:])
            except Exception:
                return f"{var_name} = None"
            return date_range_custom_days(var_name, days)
        # Relative interval: "past7days", etc.
        elif isinstance(value, str) and is_valid_relative_date_interval(value):
            fn = (
                DATE_RANGE_INPUT_RELATIVE_RANGES.get(value)
                if isinstance(value, str)
                else None
            )
            if fn:
                return fn(var_name)
            else:
                return f"{var_name} = [None, None]"
        else:
            return f"{var_name} = [None, None]"
    elif btype == "big-number":
        # Extract big-number fields from metadata and call helper
        title = metadata.get("deepnote_big_number_title", "")
        value_var = metadata.get("deepnote_big_number_value", "")
        comparison_title = metadata.get("deepnote_big_number_comparison_title", "")
        comparison_var = metadata.get("deepnote_big_number_comparison_value", "")
        return execute_big_number(title, value_var, comparison_title, comparison_var)
    elif btype == "sql":
        integration_id = metadata.get("sql_integration_id")
        if integration_id:
            connection_env_var = f"SQL_{integration_id}"
        else:
            connection_env_var = "SQL_ALCHEMY_JSON_ENV_VAR"
        var_name = metadata.get("deepnote_variable_name")
        var_name = sanitize_python_variable_name(var_name) if var_name else None
        return_variable_type = metadata.get(
            "deepnote_return_variable_type", "dataframe"
        )
        return execute_sql_query(
            content,
            connection_env_var,
            var_name or None,
            "cache_disabled",
            return_variable_type,
        )
    elif btype == "notebook-function":
        return "Module blocks are a [Deepnote.com only feature](https://deepnote.com). Please import this .deepnote file into your workspace on [Deepnote.com](https://deepnote.com) to use this module block."
    else:
        return content


# Helper: Convert a Deepnote block dict to a Jupyter cell
def convert_deepnote_block_to_jupyter_cell(block: dict):
    btype = block.get("type", "markdown")
    content = block.get("content", "")
    source = map_block_source(btype, content, block.get("metadata", {}))

    jupyter_type = map_block_type_to_jupyter(btype)

    if jupyter_type == "code":
        return new_code_cell(source)
    else:
        return new_markdown_cell(source)


# Helper: Convert a list of Deepnote blocks to sorted list of Jupyter cells
def convert_blocks_to_cells(blocks: list[dict]):
    return [
        convert_deepnote_block_to_jupyter_cell(block)
        for block in sorted(blocks, key=lambda b: b.get("sortingKey", ""))
    ]
