FROM golang:1.24-alpine3.22 AS builder

WORKDIR /app
    
COPY go.mod go.sum ./
RUN go mod download
    
COPY main.go .
    
RUN go build -o bin/scheduler-controller .
    
FROM alpine:3.22
    
WORKDIR /root/
COPY --from=builder /app/bin/scheduler-controller .
    
EXPOSE 9090
    
ENTRYPOINT ["./scheduler-controller"]
    