
    $(document).ready(function(){

     

       //Contact form 
        var contactForm=$(".contact-form")
        var contactFormMethod=contactForm.attr("method")
        var contactFormEndpoint=contactForm.attr("action")
       
        function displaySubmitting(submitBtn,defaultText,doSubmit){
         
          if(doSubmit)
          {
            submitBtn.addClass("disabled")
          submitBtn.html("<i class='fa fa-spin fa-spinner'></i> Submitting..")
          }else{
           submitBtn.removeClass("disabled")
           submitBtn.html(defaultText)
          }
          


        }
        contactForm.submit(function(event){
          event.preventDefault()
           
          var contactBtn=contactForm.find("[type='submit']")
          var contactBtnText=contactBtn.text()

          var contactFormData=contactForm.serialize()
          var thisForm=$(this)
          
          displaySubmitting(contactBtn , "",true)
          $.ajax({
            method:contactFormMethod,
            url: contactFormEndpoint,
            data:contactFormData,
            success: function(data){
              thisForm[0].reset()
                $.alert({
              title:"Success  !",
              content:"Your form has been submitted ! We will reach you relating your query soon !",
              theme:"modern",
            })
                setTimeout(function(){
                  displaySubmitting(contactBtn , contactBtnText ,false)
                },500)
            },
            error:function(error){
              console.log(error)
              var jsonData=error.responseJSON
              var msg=""
              $.each(jsonData,function(key,value){
                msg +=key+ ": "+value[0].message + "<br>"
              })
               $.alert({
              title:"Oops .. !",
              content:msg,
              theme:"modern",
            })
                  setTimeout(function(){
                  displaySubmitting(contactBtn , contactBtnText ,false)
                },500)
            }
          })
        })



      //AUTO SARCH      
      var searchForm = $(".search-form")
      var searchInput =searchForm.find("[name='q']")
      var typingTimer;
      var typingInterval=500
      var searchBtn=searchForm.find("[type='submit']")
      searchInput.keyup(function(event){
              clearTimeout(typingTimer)
              typingTimer=setTimeout(performSearch,typingInterval)
              })
        searchInput.keydown(function(event){
          clearTimeout(typingTimer)
        })

        function displaySearching(){
          searchBtn.addClass("disabled")
          searchBtn.html("<i class='fa fa-spin fa-spinner'></i> Searching..")


        }

        function performSearch(){
        displaySearching()
        var query = searchInput.val()
        setTimeout(function(){
           window.location.href='/search/?q='+query
         },1000)
       
        }



      // cart and add product
      var productForm= $(".form-product-ajax")
      productForm.submit(function(event){
        event.preventDefault();
        //console.log("form is not sending")
        var thisForm=$(this)
        //var actionEndPoint=thisForm.attr("action");
        var httpmethod=thisForm.attr("method");
        var formData=thisForm.serialize();
        var actionEndPoint=thisForm.attr("data-endpoint")
        $.ajax({
          url:actionEndPoint,
          method:httpmethod,
          data: formData,
          success: function(data){
            
            var submitSpan=thisForm.find(".submit-span")
            if (data.added){
            submitSpan.html( "   <button type='submit' class='p-3 btn-danger mt-3 btn-block cursor btn btn-lg'>In cart, Remove ?</button>")
          } else{
              submitSpan.html("<button type='submit' class='p-3 btn-light-green mt-3 btn-block cursor btn btn-lg'>Add To Cart</button>")
          }
          var navbarCount =$(".navbar-cart-count")
          navbarCount.text(data.CartItemCount)
          var currentPath=window.location.href
          if (currentPath.indexOf("cart") != -1){
            refreshCart()
          }
          },
          error: function(errorData){
            $.alert({
              title:"Oops .. !",
              content:"An error Occurred , please try again later !",
              theme:"modern",
            })
          }
        })

      })

      function refreshCart(){
        console.log("in cart")
        var cartTable=$(".cart-home")
        var cartBody=cartTable.find(".cart-body")
        //cartBody.html("<h1>CHANGED</h1>")
        var productRows=cartBody.find(".cart-product")
        var currentUrl=window.location.href
        
        var refreshCartUrl='/api/cart/'
        var refreshCartMethod="GET";
        var data={};
        $.ajax({
          url:refreshCartUrl,
          method:refreshCartMethod,
          data:data,
          success:function(data){
            
            var hiddenCartItememoveForm=$(".cart-item-remove-form")
            if (data.products.length>0){
            productRows.html("")
            i = data.products.length
            $.each(data.products,function(index,value){
              var newCartRemove=hiddenCartItememoveForm.clone()
              newCartRemove.css("display","block")
              newCartRemove.find(".cart-item-product-id").val(value.id)
              var p1;
              if(value.discounted_price == 0)
              {
                p1=value.price
              }
              else{
                p1=value.discounted_price
              }
              cartBody.prepend("<tr><th scope=\"row\">" + i +"</th><td><a href='" + value.url +"'>"+ value.name + "</a>"+ newCartRemove.html()+"</td>"+ "<td>"+value.price+  "</td><td>"+ p1 +  "</td> </tr>") 
              i --
            })
           
            cartBody.find(".cart-subtotal").text(data.subtotal)
            cartBody.find(".cart-total").text(data.total)
          } else {
            window.location.href=currentUrl 
          }

          },
          error:function(errorData){
               $.alert({
              title:"Oops .. !",
              content:"An error Occurred , please try again later !",
              theme:"modern",
            })
            console.log("error")
            console.log(errorData)
          }
        })
      }
    })