from django.contrib.sessions.models import Session

def delete_session(request):
    if request.session.session_key:
        session_key = request.session.session_key
        Session.objects.filter(session_key=session_key).delete()

