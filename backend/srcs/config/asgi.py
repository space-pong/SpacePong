"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

<<<<<<< HEAD
import channel.routing
=======
import chat.routing
>>>>>>> 390bbfae75df8f255d8512756a932f5fad670586

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
<<<<<<< HEAD
            AuthMiddlewareStack(URLRouter(channel.routing.websocket_urlpatterns))
=======
            AuthMiddlewareStack(URLRouter(chat.routing.websocket_urlpatterns))
>>>>>>> 390bbfae75df8f255d8512756a932f5fad670586
        ),
    }
)