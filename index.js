const fragContainer = document.querySelector('.frags')
const setsContainer = document.querySelector('.sets-list')
const topBar = document.querySelector('.set-state')
const toggleShowActive = document.querySelector('.show-active input')
const closePopup = document.querySelector('.popup-infos .close')
const popup = document.querySelector('.popup-infos')

const presetSelect = document.querySelector('#presets')
const addPreset = document.querySelector('.sets .actions-bar .add')
const editPreset = document.querySelector('.sets .actions-bar .edit')
const savePreset = document.querySelector('.sets .actions-bar .save')
const deletePreset = document.querySelector('.sets .actions-bar .delete')

var toggleList = []
var setsList = []
var activeFragments = []
var fragmentsList = [];
var fragmentsImages = []
var sets
var unselectAll
var presetsList = []
var activePreset = null

var save = getCookie('save') ? JSON.parse(getCookie('save')) : {}
if(save.activeFragments) activeFragments = save.activeFragments
if(save.presetsList) presetsList = save.presetsList
if(save.activePreset) activePreset = save.activePreset

tippy("footer a", {
   content: "Visit my Github profile !"
})

fetch('./sets.json').then(res => res.json()).then(res => init(res[0])).catch(err => console.log(err))

function init(data){
   sets = data.sets
   data.fragments.forEach((frag)=>{
      fragmentsList.push(frag.name)
      fragmentsImages.push(frag.image)
   })

   createFragmentsHTML(fragmentsList)
   toggleList = document.querySelectorAll('.frags .toggle')
   toggleList.forEach((toggle, i)=>{
      toggle.addEventListener('click', ()=>{
         if(activeFragments.indexOf(fragmentsList[i].toLowerCase()) == -1 && activeFragments.length < 7){
            // Adding
            activeFragments.push(fragmentsList[i].toLowerCase())
            toggle.classList.add('active')
         }else{
            // Deleting
            activeFragments = activeFragments.filter(el => el != fragmentsList[i].toLowerCase())
            toggle.classList.remove('active')
         }
         updateTopBar()
         updateSets()
      })
   })
   createSetsHTML(sets)
   sets.forEach((set, i)=>{
      set.tippyInstance = tippy(`#set_${i}`, {
         allowHTML: true,
         theme: 'runesets',
         animation: 'shift-toward',
         interactive: true,
         interactiveBorder: 20,
         onShown: ()=>{
            const btn = document.querySelector('.activate-set') 
            btn.addEventListener('click', (e)=>{
               const tmp = [...sets[btn.dataset.index].fragments].slice(0, 7 - activeFragments.length);
               tmp.forEach(el=>activeFragments.push(el))
               console.log(activeFragments);
               updateSets()
               updateTopBar()
               updateToggles()
            })
         },
   });
   })

   presetSelect.addEventListener('input', ()=>{
      if(presetSelect.value == 'no-preset'){
         activePreset = null
      }else{
         activePreset = presetsList.filter(el => el.id == presetSelect.value)[0]
         activeFragments = activePreset.fragments
         updateSets()
         updateTopBar()
         updateToggles()
      }
      updateCookie()
   })

   addPreset.addEventListener('click', ()=>{
      // Créer un preset
      const name = prompt("Preset's name")
      const newPreset = {
         name: name,
         fragments: [...activeFragments],
         id: Date.now()
      }
      presetsList.push(newPreset)
      activePreset = newPreset
      const option = new Option(newPreset.name, newPreset.id, false, true)
      presetSelect.appendChild(option)
      updateCookie()
   })
   editPreset.addEventListener('click', ()=>{
      if(activePreset != null){
         const name = prompt('New name')
         presetsList = presetsList.filter(el => el.id != activePreset.id)
         activePreset.name = name
         presetsList.push(activePreset)
         presetSelect.querySelector(`option[value="${activePreset.id}"]`).textContent = name
         updateCookie()
      }else{
         alert("Please select a preset")
      }
   })
   savePreset.addEventListener('click', ()=>{
      if(activePreset != null){
         presetsList = presetsList.filter(el => el.id != activePreset.id)
         activePreset.fragments = [...activeFragments]
         presetsList.push(activePreset)
         updateCookie()
         alert('Preset saved')
      }else{
         alert("Please select a preset")
      }
   })
   deletePreset.addEventListener('click', ()=>{
      if(activePreset != null){
         if(confirm('Are you sure ?')){
            presetsList = presetsList.filter(el => el.id != activePreset.id)
            presetSelect.querySelector(`option[value="${activePreset.id}"]`).remove()
            activeFragments = []
            activePreset = null
            _unselectAll()
            updateSets()
            updateTopBar()
         }
      }else{
         alert("Please select a preset")
      }
   })

   closePopup.addEventListener('click', ()=>{
      popup.classList.remove('active')
   })

   setsList = document.querySelectorAll('.sets-list .set')
   setsList.forEach((set, i)=>{
      set.addEventListener('click', ()=>{
         popup.classList.add('active')
         popup.querySelector('.set-title').textContent = sets[i].name
         popup.querySelector('.set-description').textContent = sets[i].description || 'Pas de description...'
         popup.querySelector('.set-img').src = sets[i].image || undefined
         popup.querySelector('.set-img').alt = sets[i].name
         var bodyContent = ''
         if(sets[i].levels){
            if(sets[i].levels.length == 1){
               bodyContent += `<div>1</div><div>${sets[i].levels[0].required}</div>`
            }else{
               sets[i].levels.forEach((level, lvlIndex)=>{
                  bodyContent += `<div>${level.label}</div><div>${level.required}</div>`
               })
            }
         }else{
            bodyContent += `<div>1</div><div>${sets[i].fragments.length}</div>`
         }
         popup.querySelector('.set-info .body').innerHTML = bodyContent
      })
   })
   toggleShowActive.addEventListener('input', ()=>{
      updateShowActive(toggleShowActive, setsList)
   })
   const allFrags = document.querySelectorAll(".fragment-name");
   const searchFrags = document.getElementById("search-frags")
   searchFrags.addEventListener("input", (e) => {
      allFrags.forEach(el => {
         if(el.innerHTML.toLowerCase().indexOf(searchFrags.value.toLowerCase()) > -1){
           el.style.display = 'flex'
           el.nextElementSibling.style.display = 'flex'
         }else{
            el.style.display = "none"
            el.nextElementSibling.style.display = 'none'
         }
      })
   })
   unselectAll = document.querySelector('.unselect-all')
   unselectAll.addEventListener('click', () => _unselectAll())
   tippy(unselectAll, {
      content: 'Unselect all'
   })
   if(presetsList.length != 0){
      presetsList.forEach(preset=>{
         const option = new Option(preset.name, preset.id, false, activePreset != null ? activePreset.id == preset.id ? true : false : false)
         presetSelect.appendChild(option)
      })
   }
   updateTopBar()
   updateSets()
   updateToggles()
}

function _unselectAll(){
   activeFragments = []
   toggleList.forEach(el => el.classList.remove('active'))
   updateSets()
   updateTopBar()
   updateShowActive(toggleShowActive, setsList)
}

function updateShowActive(toggleShowActive, setsList){
   setsList.forEach(set=>{
      set.style.display = toggleShowActive.checked == false ? 'flex' : set.classList.contains('active') ? 'flex' : 'none'
   })
}

function updateTopBar(){
   topBar.innerHTML = ''
   activeFragments.forEach((activeFragment, i)=>{
      var index = fragmentsList.indexOf(activeFragment)
      // topBar.innerHTML += `<img src="${index != -1 && fragmentsList[index].name != undefined ? fragmentsList[index].name : 'https://oldschool.runescape.wiki/images/Saradominist_Defence.png?d7645' }">`
      topBar.innerHTML += `<img src="${fragmentsImages[i]}">`
   })
   for (let index = 0; index < 7 - activeFragments.length; index++) {
      topBar.innerHTML += `<div class="placeholder"></div>`
   }
}

function updateToggles(){
   const tmp = [...activeFragments]
   tmp.forEach(el=>el=el.toLowerCase())
   toggleList.forEach((toggle, i)=>{
      if(tmp.indexOf(fragmentsList[i].toLowerCase()) != -1){
         toggle.classList.add('active')
      }else{
         toggle.classList.remove('active')
      }
   })
}

// Ajout des fragments sur la page
function createFragmentsHTML(fragmentsList){
   fragmentsList.forEach((fragment, i)=>{
      fragContainer.innerHTML += `<p class="fragment-name">${fragment}</p>
      <div class="actions">
        <button title="Activate this fragment" class="toggle">
          <img class="add-img" src="add.png" alt="Activate fragment" />
          <img class="delete-img" src="delete.png" alt="Deactivate fragment" />
        </button>
      </div>`
      // <button title="Fragment's details" class="info">
      //     <img src="info.png" alt="Fragmen's info" />
      //   </button>
   })
}

// Ajout des sets sur la page
function createSetsHTML(sets){
   sets.forEach((set, i)=>{
      setsContainer.innerHTML += `<div title="${set.name}" id="set_${i}" class="set">
      <img src="${set.image}" alt="">
      <span class="active-level"></span>
   </div>`
   })
}

function updateSets(){
   sets.forEach((set, i)=>{
      const levelSpan = setsList[i].querySelector('span.active-level')
      levelSpan.classList.remove('active')
      setsList[i].classList.remove('active')
      // To lowercase
      var setFrags = set.fragments
      setFrags.forEach((frag, i)=>setFrags[i] = setFrags[i].toLowerCase())
      var lowerCaseActive = [...activeFragments]
      lowerCaseActive.forEach((frag, i)=>lowerCaseActive[i] = lowerCaseActive[i].toLowerCase())
      lowerCaseActive = lowerCaseActive.filter(el => setFrags.indexOf(el) != -1)

      if(set.levels != undefined){
         //Si set possède des niveaux
         var activeLevel
         set.levels.sort((a, b) => parseInt(a.label) > parseInt(b.label) ? 1 : -1).forEach((level, iSet)=>{
            if(lowerCaseActive.length >= level.required){
               setsList[i].classList.add('active')
               activeLevel = level.label
            }
         })
         if(activeLevel && activeLevel > 1){
            levelSpan.classList.add('active')
            levelSpan.textContent = `${activeLevel}` 
         }
      }else if(lowerCaseActive.length == set.fragments.length){
         // Set activé mais aucun niveau
         setsList[i].classList.add('active')
      }else{
         // Set non activé...
      }
      var instanceContent = ''
      set.fragments.forEach(fragment=>{
         instanceContent += lowerCaseActive.indexOf(fragment.toLowerCase()) == -1 ? `<span style="font-size:1rem!important;display: block; color: brown;">${fragment}</span>` : `<span style="font-size:1rem!important;display: block;color: green">${fragment}</span>`
      })
      instanceContent += `<button data-index="${i}" class="activate-set">activate</button>`
      set.tippyInstance[0].setContent(instanceContent)   
   })
   activateSetsButtons = document.querySelectorAll('.activate-set')
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

function updateCookie(){
   setCookie('save', JSON.stringify({presetsList, activePreset, activeFragments}, 365))
}