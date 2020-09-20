
const input = document.querySelector('input');

const fetchData = async(searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params : {
            apikey: '56ca05c8',
            s: searchTerm
        }
    });
    if(response.data.Error) {
        return [];
    }
   return response.data.Search;
}


const onInput = async event => {
    const movies = await fetchData(event.target.value);
    const targetDiv = document.getElementById('target');
    for(movie of movies) {
        const div = document.createElement('div');
        div.innerHTML = `
        <img src="${movie.Poster}"/>
        `;
        targetDiv.appendChild(div);
    }
}


input.addEventListener('input', debounce(onInput));

