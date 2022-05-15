const slides = document.querySelector(".slides");
const loader = document.querySelector(".lds-ellipsis");
const container = document.querySelector(".container-slider");
const containerDots = document.querySelector(".container-dots");
const $_containerDots = $(".container-dots");

// init slides
let slideIndex = 1;

// init when loading first
const init = () => {
  setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.display = "none";
    container.style.display = "block";
    setTimeout(() => (container.style.opacity = 1), 50);
  }, 2000);
};
init();

// handle API
const callAPI = (method, url) => {
  return $.ajax({
    url: `${url}`,
    method: method,
  });
};

const processDataImages = async () => {
  try {
    const response = await callAPI(
      "GET",
      "https://jsonplaceholder.typicode.com/photos?albumId=1"
    );
    return response;
  } catch (err) {
    return err;
  }
};

processDataImages().then((response) => {
  const images = {
    response,
  };
  let source = $("#image-template").html();
  let template = Handlebars.compile(source);
  let html = template(images);
  $(".slides").html(html);
  response.map((value) => {
    let dot = $("<div class='dot' data-id=" + value?.id + "></div>");
    $_containerDots.append(dot);
  });
  handleNextPrevImages(response);
});

const handleNextPrevImages = (response) => {
  // get all dots
  const dots = containerDots.querySelectorAll("*").forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      let id = $(e.currentTarget).data("id");
      processDataAuthor(id).then((response_author) => {
        const author = {
          response_author,
        };
        let source = $("#user-template").html();
        let template = Handlebars.compile(source);
        let html = template(author);
        $(".users").html(html);
      });
      moveDot(index + 1);
    });
  });
  // set dot
  const moveDot = (index) => {
    slideIndex = index;
    updateImage();
  };

  // Next Images
  const nextSlide = () => {
    if (slideIndex !== response.length) {
      ++slideIndex;
    } else if (slideIndex === response.length) {
      slideIndex = 1;
    }
    updateImage();
  };
  const nextBtn = document.querySelector(".next");
  nextBtn.onclick = nextSlide;

  // Prev Images
  const prevSlide = () => {
    if (slideIndex !== 1) {
      --slideIndex;
    } else if (slideIndex === 1) {
      slideIndex = response.length;
    }
    updateImage();
  };
  const prevBtn = document.querySelector(".prev");
  prevBtn.onclick = prevSlide;

  // Update Image when slick next or prev
  const updateImage = () => {
    const activeSlide = slides.querySelector("[data-active]");
    slides.children[slideIndex - 1].dataset.active = true;
    activeSlide && delete activeSlide.dataset.active;

    const activeDot = containerDots.querySelector("[data-active]");
    containerDots.children[slideIndex - 1].dataset.active = true;
    activeDot && delete activeDot.dataset.active;

  };
  // call first then set active class
  updateImage();
};

const processDataAuthor = async (id) => {
  try {
    const response = await callAPI(
      "GET",
      `https://jsonplaceholder.typicode.com/users?id=${id}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

 processDataAuthor(id).then((response_author) => {
   
   const author = {
     response_author,
   };
   let source = $("#user-template").html();
   let template = Handlebars.compile(source);
   let html = template(author);
   $(".users").html(html);
 });