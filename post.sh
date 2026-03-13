#!/bin/bash

EMAIL="user@gmail.com"
PASSWORD="password"
USERNAME="user"

curl -X POST "localhost:3000/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\":\"$PASSWORD\", \"name\":\"$USERNAME\"}"
