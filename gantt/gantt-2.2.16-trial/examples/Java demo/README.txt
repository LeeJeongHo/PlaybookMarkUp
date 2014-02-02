/*
* Java Gantt Demo
* Copyrights Bryntum AB 2013
*/

This demo shows integration with Java based backend and MySQL database. 
It also uses Spring MVC 3 and Hibernate 3.5 frameworks. 
All required libraries/jars are included in the java project. 
Requirements to run this example are :

1. Java JDK 1.6 installed and added to the system path
2. MySQl 5.x
3. Java web server (preferably Apache Tomcat)
4. Eclipse IDE JEE version

The process of setting it up consists of the following steps :

1. Make sure the required components are installed
2. Run the attached sql file in your MySQL client
3. Copy gnt-all.js to the project's `WebContent/Gnt` folder and sch-gantt-all.css to `WebContent/resources/css`
4. Add your server to servers in Eclipse
5. Import the example project to Eclipse and add `WebContent/WEB-INF` folder to build sources
6. Change DB credentials in `WebContent/WEB-INF/spring/db-config.xml`
7. Run the project on the previously added server
8. Go to `localhost:8080/gnt-java` in a browser to see your application running
