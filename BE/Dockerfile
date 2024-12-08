FROM python:3.12.7-alpine

EXPOSE 8000

WORKDIR /app

ADD --chmod=755 https://astral.sh/uv/install.sh /install.sh
RUN /install.sh && rm /install.sh

RUN apk update && apk add pkgconfig && apk add --no-cache gcc musl-dev mariadb-connector-c-dev tk

COPY requirements.txt .

RUN /root/.local/bin/uv pip install --system --no-cache -r requirements.txt

COPY . .

CMD ["python3", "manage.py", "runserver", "0.0.0.0"]
