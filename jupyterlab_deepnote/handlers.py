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
        path = self.get_query_argument("path", default=None)
        if not path:
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.finish(
                json.dumps(
                    {
                        "code": 400,
                        "message": "Missing required 'path' parameter",
                    }
                )
            )
            return
        try:
            model = await ensure_async(
                self.contents_manager.get(
                    path, type="file", format="text", content=True
                )
            )
        except FileNotFoundError as e:
            self.set_status(404)
            self.set_header("Content-Type", "application/json")
            self.finish(json.dumps({"code": 404, "message": "File not found"}))
            return
        except PermissionError as e:
            self.set_status(403)
            self.set_header("Content-Type", "application/json")
            self.finish(json.dumps({"code": 403, "message": "Permission denied"}))
            return
        except Exception as e:
            self.log.exception("Error retrieving file")
            self.set_status(500)
            self.set_header("Content-Type", "application/json")
            self.finish(json.dumps({"code": 500, "message": "Internal server error"}))
            return
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
