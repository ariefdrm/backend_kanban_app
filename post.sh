#!/bin/bash

curl -X POST "localhost:3000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@mail.com", "password":"password", "name":"user"}'
