# Utiliza la imagen base de OpenJDK 17
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo pom.xml y la carpeta src al contenedor
COPY pom.xml .
COPY src ./src

# Copia el archivo maven-wrapper.properties y el wrapper de Maven (si estás usando Maven Wrapper)
COPY .mvn/ .mvn
COPY mvnw .
COPY mvnw.cmd .

# Instala las dependencias de la aplicación y compila el proyecto
RUN ./mvnw dependency:resolve
RUN ./mvnw package -DskipTests

# Expone el puerto en el que corre la aplicación
EXPOSE 8080

# Define el comando para ejecutar la aplicación
CMD ["java", "-jar", "target/kakeApp-0.0.1-SNAPSHOT.jar"]
