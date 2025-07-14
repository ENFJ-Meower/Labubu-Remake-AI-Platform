FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/cloud-computing-login-1.0-SNAPSHOT.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
