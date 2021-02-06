let weather = {
    "apiKey": "501cd47da792c61ec790cdbc6913fced",
    fetchWeather: function(city){
        fetch("http://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=metric&appid=" 
        + this.apiKey
        )
        //convert data into json
        .then((Response) => Response.json()) 
        .then((data) => this.displayWeather(data));
    },

    displayWeather: function(data){
        const{name} = data;
        const{icon, description} = data.weather[0];
        const{temp, humidity} = data.main;
        const{speed} = data.wind; 

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp +"°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "km/h"; 
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function(){
        this.fetchWeather(document.querySelector(".searchBar").value);
    }
};

// load the user's current location
let geocode = {
    reverseGeocode: function(latitude,longitude){
        var apikey = '7f51cf4d26f244d488c7acb2d949aa30';

        var api_url = 'https://api.opencagedata.com/geocode/v1/json'

        var request_url = api_url
        + '?'
        + 'key=' + apikey
        + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        + '&pretty=1'
        + '&no_annotations=1';

        // see full list of required and optional parameters:
        // https://opencagedata.com/api#forward

        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);

        request.onload = function() {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes

            if (request.status === 200){ 
            // Success!
            var data = JSON.parse(request.responseText);
             // print the location
            weather.fetchWeather(data.results[0].components.city);

            } else if (request.status <= 500){ 
            // We reached our target server, but it returned an error
                                
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
            } else {
            console.log("server error");
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            console.log("unable to connect to server");        
        };

        request.send();  // make the request
    },

    // get the data
    getLocation: function(){
        function Success(data){
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(Success, console.error);
        }
        else{
            weather.fetchWeather("Johannesburg");
        }
    }
};

document.querySelector(".search button").addEventListener("click", function(){
    weather.search();

});
   // search when using the enter keypad
document.querySelector(".searchBar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){ 
        weather.search();
    }

});

geocode.getLocation();



