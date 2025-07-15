@echo off
echo Starting Labubu Backend...
echo.

REM 设置Java路径
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12

REM 编译项目
echo Compiling project...
javac -cp "src/main/java" -d "build/classes/java/main" src/main/java/com/labubu/labububackend/*.java src/main/java/com/labubu/labububackend/*/*.java

REM 复制资源文件
echo Copying resources...
xcopy /E /Y "src\main\resources" "build\classes\java\main\"

REM 启动应用
echo Starting application on port 8080...
java -cp "build/classes/java/main" com.labubu.labububackend.LabubuBackendApplication

pause 