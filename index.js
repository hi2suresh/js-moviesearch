const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
 
     return `
             <img src="${imgSrc}" />
             ${movie.Title} (${movie.Year})
             `;
    },    
    inputValue(movie){
      return movie.Title;
    },
    async fetchData ( searchTerm ) {
     const response = await axios.get('http://www.omdbapi.com/', {
       params: {
         apikey: 'd9835cc5',
         s: searchTerm
       }
     });
   
     if (response.data.Error) {
       return [];
     }
   
     return response.data.Search;
   }
}
  
 createAutoComplete({
   root: document.querySelector('#left-autocomplete'),
   onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
   ...autoCompleteConfig   
 });

 createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
  ...autoCompleteConfig   
});

let leftMovie;
let rightMovie;
  const onMovieSelect = async (movie, summary, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        i: movie.imdbID
      }
    });
    summary.innerHTML = movieTemplate(response.data);
    console.log(response.data);
    if(side === 'left'){
      leftMovie = response.data;
    } else {
      rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
      runComparision();
    }
  }

  const runComparision = () => {
    console.log("Running");
  }

  const movieTemplate = (movieDetail) => {
    const boxOffice = parseInt(
      movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'')
    );
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    console.log(boxOffice, metaScore, imdbRating, imdbVotes);
    return `
     <article class="media">
      <figure class="media-left">
        <img src="${movieDetail.Poster}"/>
      </figure>
      <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title} </h1>
        <h4>${movieDetail.Genre} </h4>
        <p>${movieDetail.Plot} </p>
      </div>      
      </div>
     </article>
     <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
     </article>
     <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
     </article>
     <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
     </article>
     <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
     </article>
     <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
     </article>
    
    
    `;

  }
  