fetch('https://randomuser.me/api/',)
  .then(function (response){
    return response.json()
  })
  .then(function(user) {
    console.log('JS: ' + user.results[0].name.first)
  })
  .catch(function(){
    console.log('algo falló')
  });

  (async function load () {
    // await

    // adventure
    // action
    // horror
    // drama
    // animation
    // comedy

    async function getData(url) {
      const response = await fetch(url)
      const data = await response.json()
      return data;
    }
    
    const adventureList = await getData('https://yts.lt/api/v2/list_movies.json?genre=horror')
    console.log(adventureList)
  })()