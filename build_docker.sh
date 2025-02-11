docker build -t poke_compare_image .
docker run -dit --name poke_compare_app -p 8080:80 poke_compare_image