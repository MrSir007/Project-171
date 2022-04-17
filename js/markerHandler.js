var userID = null

AFRAME.registerComponent("marker-handler" , {
  init: function() {
    if (userID == null) {
      this.askUserID()
    }
    var dishes = this.getDishes()
    this.el.addEventListener("marker-found", () => {
      if (userID !== null) {
        var marker_id = this.el.id
        this.handleMarkerFound(dishes, marker_id)
      }
    })
    this.el.addEventListener("marker-lost", () => {
      this.handleMarkerLost()
    })
  },
  handleMarkerFound: function(toys, marker_id) {
    var toy = toys.filter(toy => toy.id === marker_id)[0]
    
    if (toy.is_out_of_stock == true) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This dish is unavailable today",
        timer: 2500,
        buttons: false
      })
    } else {
      var model = document.querySelector(`#model-${dish.id}`)
      model.setAttribute("position", dish.model_geometry.position)
      model.setAttribute("rotation", dish.model_geometry.rotation)
      model.setAttribute("scale", dish.model_geometry.scale)
      model.setAttribute("visible", true)

      var ingredients_container = document.querySelector(`#main-plane-${dish.id}`)
      ingredients_container.setAttribute("visible", true)

      var price_plane = document.querySelector(`#price-plane-${dish.id}`)
      price_plane.setAttribute("visible", true)
    }

    var buttonDiv = document.getElementById("button-div")
    buttonDiv.style.display = "flex"

    var ratingButton = document.getElementById("rating-button")
    var orderButton = document.getElementById("order-button")
    ratingButton.addEventListener("click", function() {
      swal({
        icon: "warning",
        title: "Order Summary",
        text: "Walk in progress"
      })
    })
    orderButton.addEventListener("click", function() {
      var userID
      userID <= 9
        ?(userID = `T0${table}`) 
        :(`T${table}`)
      this.handleOrder(userID, toy)
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks for Order!",
        text: "  ",
        timer: 2000,
        button: false
      })
    })
  },
  handleMarkerLost: function() {
    var buttonDiv = document.getElementById("button-div")
    buttonDiv.style.display = "none"
  },
  askUserID: function() {
    swal({
      title: "Please enter you user ID",
      icon: "warning",
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your user ID here",
          type: "string",
          min: 1
        }
      },
      closeOnClickOutside: false,
    }).then(inputValue => {
      userID = inputValue
    })
  },
  handleOrder: function(uid, toy) {
    firebase
      .firestore()
      .collection("Users")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data()
        if (details["current_orders"][toy.id]) {
          details["current_orders"][toy.id]["quantity"] += 1

          var current_quantity = details["current_orders"][toy.id]["quantity"]
          details["current_orders"][toy.id]["subtotal"] = current_quantity * toy.price
        } else {
          details["current_orders"][toy.id] = {
            item: toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toy.price
          }
        }
        details.total_bill += toy.price

        firebase
          .firestore()
          .collection("Users")
          .doc(doc.id)
          .update(details)
      })
  },
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("Toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data())
    })
  }
})