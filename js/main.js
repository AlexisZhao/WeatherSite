
document.getElementById('myForm').addEventListener('submit', saveWeather1);
var celsius, kelvin;
var city = null;
var output = null;
var jObject = "jObject";
var mainWeather = null;

function getHTTP(link, callback)
{
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
      if(httpRequest.readyState == 4 && httpRequest.status == 200)
      {
        callback(httpRequest.responseText);
      }
        
      else if(httpRequest.status == 404 || httpRequest.status == 502)
      {
        alert('bad data');
        document.getElementById('myForm').reset();
        //console.log('bad data');
        return false;
      }
    }
        httpRequest.open("GET", link, true);
        httpRequest.send(null);

        //console.log("2.call http");
}


function writeData(myData)
{
  output = myData;
  jObject = JSON.parse(output);
  kelvin = jObject.main.temp;
  celsius = parseFloat(kelvin - 273.15).toFixed(2);
  mainWeather = jObject.weather[0].main;
  //console.log("3.got temp");
  saveWeather2();
}


function getUrl(city)
{
  var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=98c76973fbe50e9dc568489cb21f7d21";
  //console.log("1.define url");
  getHTTP(url, writeData);
}

function saveWeather2()
{    
    var data = {
    name: city,
    temp: celsius,
    description: mainWeather
  }

  // Check if weatherData is null
  if(localStorage.getItem('weatherData') === null){
    // Init array
    var weatherData = [];
    // Add to array
    weatherData.push(data);
    // Set to localStorage
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
  } else {
    // Get weatherData from localStorage
    var weatherData = JSON.parse(localStorage.getItem('weatherData'));
    // Add weatherData to array
    weatherData.push(data);
    // Re-set back to localStorage
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
  }
  // Clear form
  document.getElementById('myForm').reset();
  // fetch weather data
  fetchWeather();

}

function saveWeather1(e){

  // Get form values
  console.log("saveWeather1 is called, validate data");
  city = document.getElementById('cityName').value;
  city = city[0].toUpperCase() + city.slice(1).toLowerCase();
  if(!validateForm(city)){
    return false;
  }

  getUrl(city);
  // Prevent form from submitting
  e.preventDefault();
}

// Delete weather
function deleteWeather(name){
  // Get weather data from localStorage
  var weatherData = JSON.parse(localStorage.getItem('weatherData'));
  // Loop throught weather data
  if (weatherData != null)
  {
    for(var i =0;i < weatherData.length;i++){
    if(weatherData[i].name == name){
      // Remove from array
      weatherData.splice(i, 1);
    }
  }

  }
  
  // Re-set back to localStorage
  localStorage.setItem('weatherData', JSON.stringify(weatherData));

  // Re-fetch weather data
  fetchWeather();
}

// Fetch weather data
function fetchWeather(){
  // Get weather data from localStorage
  var weatherData = JSON.parse(localStorage.getItem('weatherData'));
  // Get output id
  var weatherResults = document.getElementById('weatherResults');
  // Build output
  weatherResults.innerHTML = '';

  if (weatherData != null)
  {
    for(var i = 0; i < weatherData.length; i++){
    var name = weatherData[i].name;
    var celsius = weatherData[i].temp;
    var mainWeather = weatherData[i].description;
    weatherResults.innerHTML += '<div class="well">'+
                                  '<h3>'+name+ '&nbsp' + celsius + '&nbsp' + mainWeather +
                                  ' <a onclick="deleteWeather(\''+name+'\')" class="btn btn-danger" >Delete</a> ' +
                                  '</h3>'+
                                  '</div>';
  }
}

  console.log("4.finish fetch");
}

// Validate Form
function validateForm(city){
    var weatherData = JSON.parse(localStorage.getItem('weatherData'));   

    if(city)
    {
      if (weatherData != null)
      {
        for (var i=0; i<weatherData.length;i++)
        {
          if (weatherData[i].name == city)
          {
             alert('You have already added that city');
             return false;       
          }
        }
      }
    }
    else
    {
          alert('Please fill in the form');
       return false;
    }
  return true;
}
