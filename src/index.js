// Difficult lab in weird ways:
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", addNewToy);
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys();

  document.addEventListener("click", (event) => {
    if(event.target.matches(".like-btn")) {
      updateLikes(event);
    }
  });
});

function getToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      console.log("data: ", data);
      data.forEach(toyObj => showToys(toyObj))
    })
}

function showToys(toyObj) {
  console.log("showToys() function called")
  console.log("toyObj: ", toyObj);
  const toyCollection = document.querySelector("#toy-collection");
  const divTag = document.createElement("div");
  divTag.classList.add("card");
  const h2Tag = document.createElement("h2");
  h2Tag.textContent = toyObj["name"];
  const imgTag = document.createElement("img");
  imgTag.src = toyObj["image"];
  imgTag.classList.add("toy-avatar");
  const paragraphTag = document.createElement("p");
  paragraphTag.textContent = `${toyObj.likes} likes`;
  paragraphTag.id = toyObj["id"];
  const likeButton = document.createElement("button");
  likeButton.classList.add("like-btn");
  likeButton.textContent = "like";
  likeButton.id = toyObj["id"];
  console.log("likeButton: ", likeButton);
  divTag.append(h2Tag, imgTag, paragraphTag, likeButton);
  toyCollection.append(divTag);
}

function addNewToy(event) {
  event.preventDefault();
  console.log("event.target[0].value: ", event.target[0].value);
  // NOTE: This is using 'destructuring':
  const [name, image] = event.target;
  console.log("name: ", name.value);
  console.log("image: ", image.value);

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: name.value,
      image: image.value,
      likes: 0
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log("response: ", response);
      showToys(response);
    });
  name.value = "";
  image.value = "";
}

function updateLikes(e) {
  e.preventDefault();
  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      likes: parseInt(event.target.parentElement.children[2].textContent.split(" ")[0], 10) + 1
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log(event);
      // event.target.parentNode.children[2].textContent = `${response.likes}`;
      const p = document.getElementById(response.id);
      p.textContent = `${response.likes} likes`;
    });
}
