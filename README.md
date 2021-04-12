# VBS.shop

Minjae Park

Made for Serving Life Church

## About

[Heroku Link](https://vbs-shop.herokuapp.com)

Simple shopping catalog for VBS (Vacation Bible School) students to redeem the points they earned throughout the program.

The application and site was developed in response to COVID-19 pandemic, which prevents gathering of students and teachers for the Talent Festival.

Students would normally visit the Talent Festival with their "Talents", points each student can earn by participating and performing well throughout the VBS program. Using the Talents, students would be able to visit stands with prizes, then redeem them using their talents.

Due to the COVID-19 Pandemic, the entire VBS program was moved to the virtual platform, but the VBS team still watned to give the students the opportunities to spend their points without risking them to any physical contact.

## Dependencies

- Express: URL handling and routing
  - Express-handlebars: Handlebars template engine integration
  - Express-session: Store user sessions
  - Express-paginate: pagination links handler
- Mongoose: Interact with a MongoDB database
  - connect-mongo: handle connections to MongoDB
  - mongoose-paginate: split document entries for pagination
- passport: authentication
  - passport-local: local authentication method
  - passport-local-mongoose: store authentication info in MongoDB user table
- Body-Parser: parse http requests
  - method-override: allow more robust https request handling
- connect-ensure-login: handling unauthenticated requests to authenticated only urls
- dot-env: environment variables
- cross-env: use environment variables across platforms
- moment: time formatting
- morgan: logging

## Dev Dependencies

- nodemon: automatically restart server when file changes
- glob: bulk file handling
- fast-csv: csv parsing for catalogues