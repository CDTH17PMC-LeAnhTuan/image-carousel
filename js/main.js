const slides = document.querySelector(".slides");
const loader = document.querySelector(".lds-ellipsis");
const container = document.querySelector(".container-slider");
const containerDots = document.querySelector(".container-dots");

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
  let source = document.getElementById("image-template").innerHTML;
  let template = Handlebars.compile(source);
  let html = template(images);
  document.querySelector(".slides").innerHTML = html;
  response.map(() => {
    let dot = document.createElement("div");
    dot.classList.add("dot");
    containerDots.appendChild(dot);
  });
  handleNextPrevImages(response);
});

const handleNextPrevImages = (response) => {
  // get all dots
  const dots = containerDots.querySelectorAll("*").forEach((dot, index) => {
    dot.addEventListener("click", () => {
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

const processDataAuthor = async () => {
  try {
    const response = await callAPI(
      "GET",
      "https://jsonplaceholder.typicode.com/users"
    );
    return response;
  } catch (err) {
    return err;
  }
};

processDataAuthor().then((response) => {
  console.log(response);
});
