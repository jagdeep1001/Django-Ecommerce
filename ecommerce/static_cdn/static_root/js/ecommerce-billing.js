$(document).ready(function(){


var stripeFormModule= $(".stripe-payment-form")
var stripeModuleToken=stripeFormModule.attr('data-token')
var stripeModuleNextUrl=stripeFormModule.attr('data-next-url')
var stripeModuleBtnTitle=stripeFormModule.attr("data-btn-title") || "Add"
var stripeTemplate= $.templates("#stripeTemplate")
var stripeTemplateDataContext= {
  publish_key: stripeModuleToken,
  nextUrl:stripeModuleNextUrl,
  btn_title:stripeModuleBtnTitle



 }

var stripeTemplateHtml=stripeTemplate.render(stripeTemplateDataContext)
stripeFormModule.html(stripeTemplateHtml)




var paymentForm=$(".payment-form")
if (paymentForm.length>1){
  alert("Only one payment form is allowed per page")
  paymentForm.css('display','none')
} 
else if (paymentForm.length==1)  {
  var pubKey=paymentForm.attr('data-token')
	// Create a Stripe client.
  var nextUrl=paymentForm.attr('data-next-url')

var stripe = Stripe('pk_test_51H9rZQLKnk93DpkP81Y828IvXM5Biwp2Ovf0mPuM4MTE8BP3C4gVq09scpUYe36EweJasoLYdJylditDT6WsVmsY00adtFQrmP');

// Create an instance of Elements.
var elements = stripe.elements();


var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.on('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
// var form = document.getElementById('payment-form');
// form.addEventListener('submit', function(event) {
//   event.preventDefault();
//     var loadTime=1500
//     var errorHtml="<iclass='fa fa-warning'></i>An error Occurred !"
//     var errorClasses="btn btn-danger disabled my-3"
//     var loadingHtml ="<iclass='fa fa-spin fa-spinner'></i>Loading..."
//     var loadingClasses="btn btn-success disabled my-3"
//   stripe.createToken(card).then(function(result) {
//     if (result.error) {
//       // Inform the user if there was an error.
//       var errorElement = document.getElementById('card-errors');
//       errorElement.textContent = result.error.message;
//     } else {
//       // Send the token to your server.
//       stripeTokenHandler(nextUrl,result.token);
//     }
//   });
// });


var form = $('#payment-form');
var btnLoad=form.find(".btn-load");
var btnLoadDefaultHtml=btnLoad.html();
var btnLoadDefaultClasses=btnLoad.attr("class");
form.on('submit', function(event) {
  event.preventDefault();


    var $this =$(this) 
    //btnLoad=$this.find('.btn-load')
    btnLoad.blur()
    var loadTime=1500
    var currentTimeout;
    var errorHtml="<i class='fa fa-warning'></i>An error Occurred !"
    var errorClasses="btn btn-danger disabled my-3"
    var loadingHtml ="<i class='fa fa-spin fa-spinner'></i>Loading..."
    var loadingClasses="btn btn-success disabled my-3"
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = $('#card-errors');
      errorElement.textContent = result.error.message;
      currentTimeout=displayBtnStatus(
        btnLoad,errorHtml,errorClasses,1000,currentTimeout)
    } else {
      // Send the token to your server.
      currentTimeout=displayBtnStatus(
        btnLoad,loadingHtml,loadingClasses,2000,currentTimeout)
      stripeTokenHandler(nextUrl,result.token);
    }
  });
});


function displayBtnStatus(element,newHtml,newClasses,loadTime,timeout){
    // if (timeout){
    //   clearTimeout(timeout)
    // }
    if (!loadTime){
      loadTime=1500
    }
  //var defaultHtml=element.html()
  //var defaultClasses=element.attr("class")
  element.html(newHtml)
  element.removeClasses(btnLoadDefaultClasses)
  element.addClass(newClasses)
  return setTimeout(function(){
    element.html(btnLoadDefaultHtml)
  
  element.removeClass(newClasses)
  element.addClasses(btnLoadDefaultClasses)

  },loadTime)

}
function redirectToNext(nextPath,timeoffset){
if (nextPath)
{
 setTimeout(function(){        
            window.location.href=nextUrl
              },timeoffset) 
}  

}
// Submit the form with the token ID.
function stripeTokenHandler(nextUrl,token) {
  // Insert the token ID into the form so it gets submitted to the server
  // var form = document.getElementById('payment-form');
  // var hiddenInput = document.createElement('input');
  // hiddenInput.setAttribute('type', 'hidden');
  // hiddenInput.setAttribute('name', 'stripeToken');
  // hiddenInput.setAttribute('value', token.id);
  // form.appendChild(hiddenInput);

  // // Submit the form
  // form.submit();
  var paymentMethodEndpoint='/billing/payment-method/create'
  var data ={
    'token':token.id
  }
  $.ajax({
    data:data,
    url:paymentMethodEndpoint,
    method:"POST",
    success:function(data){
      var Successmsg=data.message || "Success! Your card was added !"
      card.clear()
      if (nextUrl)
      {
        Successmsg= Successmsg + "<br><br><i class='fa fa-spin fa-spinner' style='color:green'></i>  Redirecting ..."
      }
      if($.alert){
        $.alert(Successmsg)
     
      }  else{
        alert(Successmsg)
        
      }
       btnLoad.html(btnLoadDefaultHtml)
       btnLoad.attr('class',btnLoadDefaultClasses)
      
      redirectToNext(nextUrl,1500)
   },
    error:function(error){
      //console.log(error)
      $.alert({title:"An error Occured",content:"Please try adding your card again"})
      btnLoad.html(btnLoadDefaultHtml)
       btnLoad.attr('class',btnLoadDefaultClasses)
    }
  })

}
}

})