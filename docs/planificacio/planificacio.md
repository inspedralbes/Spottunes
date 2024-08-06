# Planificació del projecte
## SPRINT 1
Del 29/1/2024 al 02/02/2024

### Planificació i Configuració Inicial
- Refineu la idea del projecte.
- Creació del repositori a GitHub.
- Configuració inicial a Taiga amb la creació del backlog.
- Vinculem totes les parts dels Dockers entre si per assegurar un entorn de producció funcional tant en Linux com en Windows.
- Definim l'estructura de la taula d'usuaris de la base de dades.

### Disseny i Desenvolupament Front-End
- Iniciem el disseny mòbil en Figma per a la landing page i la pantalla de propers esdeveniments.
- Continuem amb el disseny mòbil en Figma per al menú de navegació i la pantalla de xat.
- Dissenyem el login i el registre.
- Introduïm l'ús de Tailwind CSS per al disseny de la pàgina d'esdeveniments.
- Comencem amb tutorials de React i el desenvolupament de la interfície d'usuari.

### Connexió amb APIs i Desenvolupament Back-End
- Implementem la connexió amb Spotify utilitzant Node.js i Laravel.
- Solucionem problemes amb Docker per assegurar que la integració funcionés correctament.
- Assegurem que la connexió amb l'API de Spotify estigués 100% operativa.


## SPRINT 2
Del 05/02/2024 al 09/02/2024

### Web Scraping
Inicialment, implementem tècniques de web scraping utilitzant JavaScript i Python, enfocant-nos especialment en la plataforma Viagogo. Tanmateix, decidim descartar el web scraping a favor d'utilitzar APIs oficials per obtenir les dades necessàries.


### Autenticació i API
- Registrem l'API utilitzant email i contrasenya.
- Implementem i completem l'autenticació amb Google per assegurar un correcte emmagatzematge de les dades.
- Comencem la documentació dels endpoints utilitzant Swagger i OpenAPI per assegurar una clara especificació de les nostres APIs.

### Desenvolupament Front-End
- Creem la landing page per a mòbil utilitzant React.
- Dissenyem en Figma les pantalles mòbils per a perfil, login i registre.
- Desenvolupem la pantalla d'esdeveniments i el menú de navegació per a mòbil amb React.
- Millorem el menú i dissenyem detalladament un esdeveniment específic en Figma.


### Interacció amb APIs
- Estudiem i utilitzem l'API de Ticketmaster per obtenir dades d'esdeveniments.
- Implementem fetch a l'API de Ticketmaster i guardem les dades a la base de dades.
- Utilitzem Axios en React per realitzar fetch a un JSON estàtic i a l'API de la plataforma de tiquets de concerts, assegurant la correcta integració de dades a la nostra aplicació.


### Back-End i Connexió Front-Back
- Canviem el fetch de Laravel a Node.js per millorar la integració i eficiència del projecte.
- Afegim filtres en el fetch per evitar la repetició d'esdeveniments i optimitzar la gestió de dades.


### Problemes i Solucions
No vam poder pujar l'aplicació a producció a causa de la falta d'espai als laboratoris. Estem preparant una màquina Oracle per solucionar aquest problema.


**En finalitzar el SPRINT, vam aconseguir tenir una base sòlida per a l'aplicació, amb diversos components essencials desenvolupats i la integració de dades mitjançant APIs avançant segons el planificat.**


## SPRINT 3
Del 12/02/2024 al 16/02/2024

### Objectiu del Sprint
Aixecar la màquina Oracle i configurar el login/register normal i amb Spotify.

### Desenvolupament Back-End
- Implementem el login i el maneig de tokens al back-end amb Spotify i Google.
- Configurem el scheduling en Node.js per fer fetch a l'API de Ticketmaster a les 00:00 i 12:00, i eliminar esdeveniments passats cada hora.
- Despleguem l'aplicació en Oracle Cloud utilitzant Docker.

### Desenvolupament Front-End
- Desenvolupem el login i el maneig de tokens al front-end amb Spotify i Google.
- Afegim el maneig de dades d'usuari i tokens al front-end.
- Millorem l'accessibilitat del menú, afegim contextos de React per a variables globals i controlem l'estat d'usuari loguejat.

### Millores i Correcció d'Errors
#### Login y Registre:
- Afegim un loader quan l'usuari fa clic en login.
- Registrem la fetch API de Spotify, maneguem les peticions asíncrones i resolem errors de fetch en components React.
- Solucionem problemes de classes en SVG diferents i variables globals per millorar la navegació autenticada.

#### Perfil i Esdeveniments:
- Millorem la pantalla de perfil i completem el disseny de la pantalla d'esdeveniment individual.
- Ajustem l'scroll que afectava el menú i millorem l'accessibilitat general del menú.

#### Integració i Desplegament:
- Ajudem a resoldre problemes amb les rutes per posar en producció amb Pedro.
- Solucionem bugs relacionats amb fetch i la gestió de dades en el context de React.


### Revisió del Sprint
Implementem amb èxit el login/register amb Spotify i Google, millorem l'accessibilitat i usabilitat del menú i les pantalles de perfil i esdeveniments, i despleguem l'aplicació en Oracle Cloud. A més, resolvem diversos errors i optimitzem la funcionalitat del fetch de dades.

**En finalitzar el SPRINT, aconseguim establir una robusta autenticació amb Spotify i Google, millorar l'experiència d'usuari al front-end, i realitzar el desplegament en un entorn de producció sòlid, tot i afrontar i resoldre diversos problemes tècnics.**

## SPRINT 4
Del 17/02/2024 al 23/02/2024

### Desenvolupament Back-End
Correcció d'errors i problemes amb els fitxers .env.
Implementació de l'API per a la gestió de seguidors.
Modificació del scheduling per emmagatzemar esdeveniments en lloc d'eliminar-los.
Creació de les API per a esdeveniments, likes i comentaris.
Implementació de l'API per a la publicació de posts amb imatges.
Recuperació de la clau privada per al servidor.
Finalització de la base de dades MongoDB i inici de l'emmagatzematge d'imatges.
Correccions en les actions i desplegament de contenidors Docker per a MongoDB i MongoDB Express.
Implementació de funcionalitats de likes i dislikes en esdeveniments per a usuaris.

### Desenvolupament Front-End
Finalització del disseny de la pantalla de xat individual a Figma.
Correcció del component del logo per enllaçar a la ruta /events.
Actualització de la pantalla de perfil d'usuari.
Implementació de funcionalitats per mostrar seguidors i seguits al perfil i a la pantalla d'esdeveniment individual.
Finalització del disseny de les pantalles de "amics" i "pujar post" a Figma.

### Millores i Correcció d'Errors
Solució d'errors relacionats amb Google login.
Correcció de problemes amb la landing page.
Correcció de bugs en sol·licituds GET i DELETE amb MongoDB.
Realització de proves per assegurar el correcte funcionament de l'aplicació.


### Revisió del Sprint
En el Sprint 4 es va avançar considerablement en el desenvolupament del projecte. Es van completar diverses funcionalitats importants, com la gestió de seguidors, la publicació de posts amb imatges, la implementació de likes i dislikes en esdeveniments, i el disseny de noves pantalles. També es van solucionar errors i es van realitzar millores en el rendiment de l'aplicació.

**En finalitzar el Sprint, es va aconseguir un progrés significatiu en la implementació de les funcionalitats principals del projecte, tot i que encara queden algunes tasques pendents per completar el desenvolupament.**

## SPRINT 5
Del 29/04/2024 al 10/05/2024

### Desenvolupament Back-End
- Actualització del component "menú" perquè la ruta sempre comenci per /events.
- Addició del component "menú" a la pantalla d'esdeveniment individual.
- Ampliació de la informació a la pantalla d'esdeveniment individual.
- Addició d'un encapçalament a la pantalla d'esdeveniment individual per seguir i sortir de l'esdeveniment.
- Emmagatzematge d'imatges comprimides a Node.
- Solució de problemes de login amb JSON en context.
- Integració d'informació del compte de Spotify.
- Implementació d'un commutador per al botó "seguir" a la pantalla d'esdeveniment individual.
- Correcció d'errors d'emmagatzematge local.
- Inici de la migració de React a Nuxt.
- Correcció de dades de login.
- Solució de problemes de "like" a esdeveniments amb usuaris autenticats que es comuniquen amb MongoDB.
- Implementació del proxy invers.
- Creació d'un servidor de preproducció per realitzar proves del proxy invers.
- Implementació de la funció per publicar un post.
- Implementació de la funció per mostrar els posts al perfil.
- Implementació d'un menú desplegable d'opcions de post.
- Inici de la implementació del cercador d'usuaris per iniciar un xat.

### Desenvolupament Front-End
- Actualització del component "menu" perquè la ruta sempre comenci per /events.
- Addició del component "menu" a la pantalla d'esdeveniment individual.
- Ampliació de la informació a la pantalla d'esdeveniment individual.
- Addició d'un encapçalament a la pantalla d'esdeveniment individual per seguir i sortir de l'esdeveniment.
- Implementació d'un commutador per al botó "seguir" a la pantalla d'esdeveniment individual.
- Inici de la migració de React a Nuxt.
- Solució de problemes de "like" a esdeveniments amb usuaris autenticats que es comuniquen amb MongoDB.
- Implementació de la funció per publicar un post.
- Implementació de la funció per mostrar els posts al perfil.
- Implementació d'un menú desplegable d'opcions de post.
- Inici de la implementació del cercador d'usuaris per iniciar un xat.

### Millores i Correcció d'Errors
- Solució d'errors de login.
- Correcció de problemes amb la landing page.
- Correcció de bugs en sol·licituds GET i DELETE amb MongoDB.
- Realització de proves per assegurar el correcte funcionament de l'aplicació.
- Arranjament del docker-compose.
- Adaptació de tots els icones.
- Correcció d'errors de color de fons.
- Modificació del menú per millorar l'accessibilitat.
- Programació de la pantalla de xat individual.
- Programació de la pantalla de tots els xats.
- Pensament en l'estructura del xat i la tecnologia a utilitzar.
- Ajuda a Raúl amb actions i proxy invers.
- Començament de la implementació del xat.
- Creació del servidor de preproducció.
- Disseny de la pantalla de posts.

### Revisió del Sprint
En el Sprint 5 es va avançar considerablement en el Desenvolupament del projecte. Es van completar diverses funcionalitats importants, com l'actualització del component "menu", l'ampliació de la informació a la pantalla d'esdeveniment individual, la implementació del commutador per al botó "seguir", la migració de React a Nuxt, la implementació de la funció per publicar un post, la implementació de la funció per mostrar els posts al perfil, la implementació d'un menú desplegable d'opcions de post, l'inici de la implementació del cercador d'usuaris per iniciar un xat, la solució d'errors de login, la correcció de problemes amb la landing page, la correcció de bugs en sol·licituds GET i DELETE amb MongoDB, la realització de proves per assegurar el correcte funcionament de l'aplicació, l'arranjament del docker-compose, l'adaptació de tots els icones, la correcció d'errors de color de fons, la modificació del menú per millorar l'accessibilitat, la programació de la pantalla de xat individual, la programació de la pantalla de tots els xats, el pensament en l'estructura del xat i la tecnologia a utilitzar, l'ajuda a Raúl amb actions i proxy invers, el començament de la implementació del xat, la creació del servidor de preproducció i el disseny de la pantalla de posts.

**Al finalitzar el Sprint, es va aconseguir un progrés significatiu en la implementació de les funcionalitats principals del projecte, encara que encara queden algunes tasques pendents per completar el Desenvolupament.**


## SPRINT 6
Del 13/05/2024 al 24/05/2024

### Desenvolupament Back-End
- Correcció d'errors en la funció per mostrar els posts en el perfil.
- Implementació de la funció per eliminar un post.
- Correcció d'errors en la funció per donar i treure likes a un post.
- Implementació de la funció per mostrar els seguidors d'un esdeveniment.
- Correcció d'errors en la funció per mostrar els seguits d'un usuari.
- Implementació de la funció per seguir a un usuari.
- Correcció d'errors en la funció per deixar de seguir a un usuari.
- Implementació de la funció per buscar usuaris.
- Correcció d'errors en la funció per mostrar els xats d'un usuari.
- Implementació de la funció per enviar missatges en un xat.
- Correcció d'errors en la funció per mostrar els missatges d'un xat.
- Implementació de la funció per eliminar un missatge d'un xat.
- Implementació de la funció per eliminar un xat.
- Correcció d'errors en la funció per mostrar les notificacions d'un usuari.
- Implementació de la funció per marcar una notificació com a llegida.
- Correcció d'errors en la funció per eliminar una notificació.
- Implementació de la funció per pujar una imatge de perfil.
- Correcció d'errors en la funció per mostrar la imatge de perfil d'un usuari.
- Implementació de la funció per eliminar la imatge de perfil d'un usuari.

### Desenvolupament Front-End
- Correcció d'errors en la pantalla de perfil.
- Implementació de la pantalla per eliminar un post.
- Correcció d'errors en la pantalla per donar i treure likes a un post.
- Implementació de la pantalla per mostrar els seguidors d'un esdeveniment.
- Correcció d'errors en la pantalla per mostrar els seguits d'un usuari.
- Implementació de la pantalla per seguir a un usuari.
- Correcció d'errors en la pantalla per deixar de seguir a un usuari.
- Implementació de la pantalla per buscar usuaris.
- Correcció d'errors en la pantalla per mostrar els xats d'un usuari.
- Implementació de la pantalla per enviar missatges en un xat.
- Correcció d'errors en la pantalla per mostrar els missatges d'un xat.
- Implementació de la pantalla per eliminar un missatge d'un xat.
- Implementació de la pantalla per eliminar un xat.
- Correcció d'errors en la pantalla per mostrar les notificacions d'un usuari.
- Implementació de la pantalla per marcar una notificació com a llegida.
- Correcció d'errors en la pantalla per eliminar una notificació.
- Implementació de la pantalla per pujar una imatge de perfil.
- Correcció d'errors en la pantalla per mostrar la imatge de perfil d'un usuari.
- Implementació de la pantalla per eliminar la imatge de perfil d'un usuari.

### Revisió del Sprint
**Es va avançar considerablement en la implementació de les funcionalitats del projecte, enfocant-se en la part d'usuaris i les seves interaccions.**