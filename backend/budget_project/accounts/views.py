from .models import CustomUser  # Import your custom user model
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class RegisterView(CreateAPIView):
    queryset = CustomUser.objects.all()  # Use CustomUser model here
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Check if the username already exists
        username = request.data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"username": ["This username is already taken."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the email already exists
        email = request.data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {"email": ["This email is already taken."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Proceed with the default behavior if the username and email are unique
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )