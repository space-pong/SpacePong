from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import asyncio

class AliasAPIView(APIView):
    async def post(self, request, *args, **kwargs):
        aliases = request.data.get('aliases', [])
        if not isinstance(aliases, list):
            return Response({"error": "aliases must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        seen = {}
        modified_aliases = []

        for alias in aliases:
            if alias in seen:
                seen[alias] += 1
                modified_alias = f"{alias}{seen[alias]}"
            else:
                seen[alias] = 0
                modified_alias = alias
            modified_aliases.append(modified_alias)
        
        await asyncio.sleep(0)  # Simulate async work if necessary

        return Response({"modified_aliases": modified_aliases}, status=status.HTTP_200_OK)
