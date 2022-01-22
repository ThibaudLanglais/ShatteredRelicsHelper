const fragContainer = document.querySelector('.fragments-container')
const setsContainer = document.querySelector('.sets-container')
const searchFrags = document.querySelector("#search-frags")
const searchSets = document.querySelector("#search-sets")
const selectAll = document.querySelector('.select-all')
const unselectAll = document.querySelector('.unselect-all')

var inputList = []
var setsList = []
var sets
var save = getCookie('save') ? JSON.parse(getCookie('save')) : {}

tippy("footer a", {
   content: "Visit my Github profile !"
})

fetch('./sets.json').then(res => res.json()).then(res => init(res[0])).catch(err => console.log(err))

function init(data){
   sets = data.sets
   var fragmentsList = data.fragments

   createFragmentsHTML(fragmentsList)
   createSetsHTML(sets)

   updateSets(sets)

   const allFrags = document.querySelectorAll(".fragment-item");
   const allSets = document.querySelectorAll(".set-item");

   searchFrags?.addEventListener("input", () => allFrags.forEach(el => el.outerHTML.toLowerCase().indexOf(searchFrags.value.toLowerCase()) > -1 ? el.style.display = 'flex' : el.style.display = "none"))
   searchSets?.addEventListener("input", () => allSets.forEach(el => el.outerHTML.toLowerCase().indexOf(searchSets.value.toLowerCase()) > -1 ? el.style.display = 'flex' : el.style.display = "none"))

   selectAll.addEventListener('click', ()=>{
      inputList.forEach(el => el.checked = true)
      updateSets(sets)
   })
   unselectAll.addEventListener('click', ()=>{
      inputList.forEach(el => el.checked = false)
      updateSets(sets)
   })

}

// Ajout des fragments sur la page
function createFragmentsHTML(fragmentsList){
   fragmentsList.forEach((fragment, i)=>{
      const div = document.createElement('div')
      div.classList.add('fragment-item')
      const input = document.createElement('input')
      input.classList.add('switch-input')
      const label = document.createElement('label')
      const span1 = document.createElement('span')
      span1.classList.add('switch-label')
      span1.dataset.on = 'on'
      span1.dataset.off = 'off'
      const span2 = document.createElement('span')
      span2.classList.add('switch-handle')
      label.textContent = fragment
      label.classList.add('switch')
      label.htmlFor = `frag_${i}`
      input.type = 'checkbox'
      input.id = `frag_${i}`
      input.name = fragment
      input.checked = save[input.name] != undefined ? save[input.name] : false 
      fragContainer.appendChild(div)
      div.appendChild(label)
      label.appendChild(input)
      label.appendChild(span1)
      label.appendChild(span2)
      inputList.push(input)
      input.addEventListener('input', ()=>updateSets(sets))
   })
}

// Ajout des sets sur la page
function createSetsHTML(sets){
   sets.forEach((set, i)=>{
      const div = document.createElement('div')
      div.id = `set_${i}`
      div.dataset.name = set.name
      div.classList.add('set-item')
      div.textContent = set.name
      setsContainer.appendChild(div)
      setsList.push(div)
      set.tippyInstance = tippy(`#set_${i}`, {
         allowHTML: true
       });
   })
}

function updateSets(sets){
   sets.forEach((set, i)=>{
      setsList[i].classList.remove('orange')
      setsList[i].classList.remove('active')
      var setFrags = set.fragments
      setFrags.forEach((frag, i)=>setFrags[i] = setFrags[i].toLowerCase())
      const res = inputList.filter(el => el.checked && setFrags.indexOf(el.name.toLowerCase()) != -1)
      res.forEach((el, i)=>{
         res[i] = el.name.toLowerCase()
      })
      if(set.levels != undefined){
         var activeLevel
         set.levels.sort((a, b) => parseInt(a.label) > parseInt(b.label) ? 1 : -1).forEach((level, iSet)=>{
            if(res.length >= level.required){
               setsList[i].classList.add('active')
               activeLevel = level.label
            }else if(res.length == level.required-1 && iSet == 0){
               setsList[i].classList.add('orange')
            }
         })
         setsList[i].textContent = `${setsList[i].dataset.name} ${activeLevel && activeLevel != 0 ? `(${activeLevel})` : ''}` 
      }else if(res.length == set.fragments.length){
         setsList[i].textContent = setsList[i].dataset.name
         setsList[i].classList.add('active')
      }else{
         setsList[i].textContent = setsList[i].dataset.name
         setsList[i].classList.remove('active')
      }
      var instanceContent = ''
      set.fragments.forEach(fragment=>{
         instanceContent += res.indexOf(fragment.toLowerCase()) == -1 ? `<span style="font-size:1rem!important;display: block;color: red">${fragment}</span>` : `<span style="font-size:1rem!important;display: block;color: green">${fragment}</span>`
      })
      set.tippyInstance[0].setContent(instanceContent)   
   })
   inputList.forEach(input => {
      save[input.name] = input.checked
   })
   setCookie('save', JSON.stringify(save), 365)
}

function setCookie(cname, cvalue, exdays) {
   const d = new Date();
   d.setTime(d.getTime() + (exdays*24*60*60*1000));
   let expires = "expires="+ d.toUTCString();
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(';');
   for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}