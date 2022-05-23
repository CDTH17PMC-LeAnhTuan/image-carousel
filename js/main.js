const slides = document.querySelector(".slides");
const loader = document.querySelector(".lds-ellipsis");
const container = document.querySelector(".container-slider");
const containerDots = document.querySelector(".container-dots");
const $_containerDots = $(".container-dots");
const containerThumnail = document.querySelector(".thumbnail-container");
const form = document.querySelector('.form-pagination');
// make pagination
let dataList = [];

// init slides
let slideIndex = 1;

// handle API
const callAPI = (method, url) => {
  return $.ajax({
    url: `${url}`,
    method: method,
  });
};

const processDataImages = async (limit) => {
  try {
    const response = await callAPI(
      "GET",
      `https://pixabay.com/api/?key=27530360-6f20742ba96654d18ed62d387&category=animals&page=1&per_page=${limit}`
      // `https://jsonplaceholder.typicode.com/photos?_start=0&_limit=${limit}`
    );
    // return response;
    return response.hits;
  } catch (err) {
    return err;
  }
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

const processDataImagesWithId = async (id) => {
  try {
    const response = await callAPI(
      "GET",
      `https://pixabay.com/api/?key=27530360-6f20742ba96654d18ed62d387&category=animals&page=1&per_page=15&id=${id}`
      // `https://jsonplaceholder.typicode.com/photos?_start=0&_limit=10&id=${id}`
    );
    // return response;
    return response.hits;
  } catch (err) {
    return err;
  }
}

processDataImages(10).then((response) => {
  const images = {
    response,
  };
  let source = $("#image-template").html();
  let source2 = $("#thumbnail-template").html();
  let template = Handlebars.compile(source);
  let template2 = Handlebars.compile(source2);
  let html = template(images);
  let html_thumbnail = template2(images);
  $(".slides").html(html);
  $(".thumbnail-container").html(html_thumbnail);
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
      // appendHtmlAuthor(id);
      appendHtmlAuthor(slideIndex);
      appendHtmlOneImage(id);
      moveDot(index + 1);
    });
  });

  // get all thumbnail child
  const thumbnail_child = containerThumnail.querySelectorAll("*").forEach((thumbnail, index) => {
    thumbnail.style.cursor = "pointer";
    thumbnail.addEventListener("click", (e) => {
      let id = $(e.currentTarget).data("id");
      // appendHtmlAuthor(id);
      appendHtmlAuthor(slideIndex);
      appendHtmlOneImage(id);
      moveDot(index + 1);
    })
  })

  // set dot
  const moveDot = (index) => {
    slideIndex = index;
    updateImage(index);
  };

  // Next Images
  const nextSlide = () => {
    if (slideIndex !== response.length) {
      ++slideIndex;
    } else if (slideIndex === response.length) {
      slideIndex = 1;
    }
    appendHtmlAuthor(slideIndex);
    appendHtmlOneImage(slideIndex);
    updateImage(slideIndex);
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
    appendHtmlAuthor(slideIndex);
    appendHtmlOneImage(slideIndex);
    updateImage(slideIndex);
  };
  const prevBtn = document.querySelector(".prev");
  prevBtn.onclick = prevSlide;

  // Update Image when slick next or prev
  const updateImage = (slideIndex) => {
    const activeSlide = slides.querySelector("[data-active]");
    slides.children[slideIndex - 1].dataset.active = true;
    activeSlide && delete activeSlide.dataset.active;

    const activeDot = containerDots.querySelector("[data-active]");
    containerDots.children[slideIndex - 1].dataset.active = true;
    activeDot && delete activeDot.dataset.active;
  };
  // call first then set active class
  updateImage(slideIndex);

  const autoPlay = () => {
    if (slideIndex !== slides.children.length) {
      ++slideIndex;
    } else if (slideIndex === slides.children.length) {
      slideIndex = 1;
    }
    updateImage(slideIndex);
    appendHtmlAuthor(slideIndex);
  }
  setInterval(autoPlay, 3500);
};

const appendHtmlAuthor = (id) => {
  processDataAuthor(id).then((response_author) => {
    const author = {
      response_author,
    };
    let source = $("#user-template").html();
    let template = Handlebars.compile(source);
    let html = template(author);
    $(".users").html(html);
  });
}

const appendHtmlOneImage = (id) => {
  processDataImagesWithId(id).then((response_img) => {
    const image = {
      response_img,
    };
    let source = $("#one-image-template").html();
    let template = Handlebars.compile(source);
    let html = template(image);
    $(".popup-content").html(html);
  });
}


const FetchData = async () => {
  const response = await fetch('https://pixabay.com/api/?key=27530360-6f20742ba96654d18ed62d387&category=animals&page=1&per_page=200')
  const data = await response.json();
  dataList = data.hits;
  // console.log(dataList);
}

const appendDataPagination = () => {
  let source = $("#pagination").html();
  let template = Handlebars.compile(source);
  $("#itemContainer").append(template(dataList));
}

const pagination = async () => {
  await FetchData();
  appendDataPagination();
  $("div.holder").jPages({
    containerID: "itemContainer",
    perPage: 5,
    minHeight: false
  });
  $("select").change(function () {
    let newPerPage = parseInt($(this).val());
    $("#itemContainer").css("display", "flex");
    $("div.holder").jPages("destroy").jPages({
      containerID: "itemContainer",
      perPage: newPerPage,
      minHeight: false
    });
  });
}

// init when loading first
const init = async () => {
  await setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.display = "none";
    container.style.display = "block";
    containerThumnail.style.display = "flex";
    containerDots.style.opacity = 1;
    form.style.display = "block";
    let outerContentWidth = $('.thumbnail-container').width();
    let scrollPosition = outerContentWidth / 2;
    $('.thumbnail-container').scrollLeft(scrollPosition);
    appendHtmlAuthor(slideIndex);
    appendHtmlOneImage(slideIndex);
    pagination();
  }, 2000);
};
init();