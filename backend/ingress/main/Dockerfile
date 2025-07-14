FROM golang:1.24-alpine3.22 AS builder

WORKDIR /app
    
COPY go.mod go.sum ./
RUN go mod download
    
COPY main.go .
    
RUN go build -o bin/ingress-controller .
    
FROM alpine:3.22
    
WORKDIR /root/
COPY --from=builder /app/bin/ingress-controller .
    
EXPOSE 8080
    
ENTRYPOINT ["./ingress-controller"]
    