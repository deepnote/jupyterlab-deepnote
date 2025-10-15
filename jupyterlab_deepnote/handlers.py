from datetime import datetime
import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from jupyter_core.utils import ensure_async
import tornado


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    async def get(self):
        path = self.get_query_argument("path")
        # Use Jupyter Server’s contents_manager, not direct filesystem access.
        model = await ensure_async(
            self.contents_manager.get(path, type="file", format="text", content=True)
        )
        # Convert datetimes to strings so JSON can handle them
        for key in ("created", "last_modified"):
            if isinstance(model.get(key), datetime):
                model[key] = model[key].isoformat()

        # Return everything, including YAML content
        result = {"deepnoteFileModel": model}

        self.finish(json.dumps(result))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyterlab-deepnote", "file")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
