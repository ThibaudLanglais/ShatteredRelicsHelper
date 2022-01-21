const fragContainer = document.querySelector('.fragments-container')
const setsContainer = document.querySelector('.sets-container')
var sets = [
   {
      name: "Absolute Unit",
      fragments: ['Dragon On A Bit', 'Rune Escape', 'Superior Tracking', 'Armadylean Decree', 'Divine Restoration', 'Tactical Duelist', 'Saradominist Defence', 'Venomaster'],
      levels: [
         {label: '2', required: 4},
         {label: '1', required: 2},
      ]
   },
   {
      name: "The Alchemist",
      fragments: ['Golden Brick Road', 'Dine & Dash', 'Slay All Day', 'Certified Farmer', 'Homewrecker', 'Mixologist', 'Just Druid!'],
      levels: [
         {label: '', required: 4}
      ]
   },
   {
      name: "Chain Magic",
      fragments: ['Thrall Damage', 'Unholy Wizard', 'Zamorakian Sight', 'Mother\'s Magic Fossils', 'Deeper Pockets', 'Rooty Tooty 2x Runeys', 'Hot On The Trail'],
      levels: [
         {label: '2', required: 3},
         {label: '1', required: 2},
      ]
   },
   {
      name: "The Craftsman",
      fragments: ['Rumple-Bow-String', 'Dragon On A Bit', 'Imcando\'s Apprentice', 'Grave Robber', 'Profletchional', 'Pro Tips'],
      levels: [
         {label: '', required: 4}
      ]
   },
   {
      name: "Double Tap",
      fragments: ['Smithing Double', 'Rumple-Bow-String', 'Rogues\' Chompy Farm', 'Unholy Ranger', 'Armadylean Decree', 'Chinchonkers', 'Pro Tips'],
      levels: [
         {label: '2', required: 3},
         {label: '1', required: 2},
      ]
   },
   {
      name: "Drakan's Touch",
      fragments: ["Unholy Wizard","Zamorakian Sight","Clued In","Unholy Ranger","Praying Respects","Larger Recharger","Special Discount"],
      levels: [
         {label: '2', required: 4},
         {label: '1', required: 2},
      ]
   },
   {
      name: "Endless Knowledge",
      fragments: ["Arcane Conduit","Thrall Damage","Enchanted Jeweler","Alchemaniac","Imcando's Apprentice","Plank Stretcher","Mother's Magic Fossils"],
      levels: [
         {label: '', required: 4}
      ]
   },
   {
      name: "Fast Metabolism",
      fragments: ["Grave Robber","Rock Solid","Bandosian Might","Larger Recharger","Hot On The Trail","Venomaster"],
      levels: [
         {label: '', required: 3}
      ]
   },
   {
      name: "Greedy Gatherer",
      fragments: ["Message In A Bottle","Molten Miner","Rock Solid","Certified Farmer","Chef's Catch","Slash & Burn","Just Druid!"],
      levels: [
         {label: '2', required: 4},
         {label: '1', required: 3}
      ]
   },
   {
      name: "Knife\'s Edge",
      fragments: ["Barbarian Pest Wars","Message In A Bottle","Slay All Day","Bottomless Quiver","Livin' On A Prayer","Praying Respects","Unholy Warrior","Saradominist Defence"],
      levels: [
         {label: '2', required: 4},
         {label: '1', required: 2},
      ]
   },
   {
      name: "Last Recall",
      fragments: ["Enchanted Jeweler","Rune Escape","Clued In","Slay 'n' Pay","Superior Tracking","Chinchonkers","Homewrecker","Profletchional","Rooty Tooty 2x Runeys","Smooth Criminal"],
      levels: [
         {label: '', required: 5}
      ]
   },
   {
      name: "Personal Banker",
      fragments: ["Smithing Double","Alchemaniac","Molten Miner","Seedy Business","Catch Of The Day","Deeper Pockets"],
      levels: [
         {label: '2', required: 4},
         {label: '1', required: 2},
      ]
   },
   {
      name: "Trailblazer",
      fragments: ["Arcane Conduit","Golden Brick Road","Bottomless Quiver","Seedy Business","Chef's Catch","Smooth Criminal","Unholy Warrior"],
      levels: [
         {label: '', required: 3}
      ]
   },
   {
      name: "Twin Strikes",
      fragments: ["Barbarian Pest Wars","Slay 'n' Pay","Divine Restoration","Livin' On A Prayer","Tactical Duelist","Bandosian Might","Special Discount"],
      levels: [
         {label: '2', required: 3},
         {label: '1', required: 2},
      ]
   },
   {
      name: "Unchained Talent",
      fragments: ["Plank Stretcher","Rogues' Chompy Farm","Dine & Dash","Catch Of The Day","Slash & Burn","Mixologist"],
      levels: [
         {label: '', required: 3}
      ]
   }
]
var fragmentsList = [
   'Alchemaniac',
   'Arcane Conduit',
   'Armadylean Decree',
   'Bandosian Might',
   'Barbarian Pest Wars',
   'Bottomless Quiver',
   'Catch of the day',
   'Certified Farmer',
   'Chef\'s Catch',
   'Chinchonkers',
   'Clued In',
   'Deeper Pockets',
   'Dine & Dash',
   'Divine Restoration',
   'Dragon On A Bit',
   'Enchanted Jeweler',
   'Golden Brick Road',
   'Grave Robber',
   'Homewrecker',
   'Hot On The Trail',
   'Imcando\'s Apprentice',
   'Just Druid!',
   'Larger Recharger',
   'Livin\' On A Prayer',
   'Message In A Bottle',
   'Mixologist',
   'Molten Miner',
   'Mother\'s Magic Fossils',
   'Plank Stretcher',
   'Praying Respects',
   'Pro Tips',
   'Profletchional',
   'Rock Solid',
   'Rogues\' Chompy Farm',
   'Rooty Tooty 2x Runeys',
   'Rumple-Bow-String',
   'Rune Escape',
   'Saradominist Defence',
   'Seedy Business',
   'Slash & Burn',
   'Slay \'n\' Pay',
   'Slay All Day',
   'Smithing Double',
   'Smooth Criminal',
   'Special Discount',
   'Superior Tracking',
   'Tactical Duelist',
   'Thrall Damage',
   'Unholy Ranger',
   'Unholy Warrior',
   'Unholy Wizard',
   'Venomaster',
   'Zamorakian Sight'
]

var save = getCookie('save') ? JSON.parse(getCookie('save')) : {}
var inputList = []
var setsList = []

// Ajout des fragments sur la page
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
   input.addEventListener('input', updateSets)
})

// Ajout des sets sur la page
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

updateSets()

const searchFrags = document.querySelector("#search-frags")
const searchSets = document.querySelector("#search-sets")
const allFrags = document.querySelectorAll(".fragment-item");
const allSets = document.querySelectorAll(".set-item");

searchFrags?.addEventListener("input", () => allFrags.forEach(el => el.outerHTML.toLowerCase().indexOf(searchFrags.value.toLowerCase()) > -1 ? el.style.display = 'flex' : el.style.display = "none"))
searchSets?.addEventListener("input", () => allSets.forEach(el => el.outerHTML.toLowerCase().indexOf(searchSets.value.toLowerCase()) > -1 ? el.style.display = 'flex' : el.style.display = "none"))


function updateSets(){
   sets.forEach((set, i)=>{
      const res = inputList.filter(el => el.checked && set.fragments.indexOf(el.name) != -1)
      res.forEach((el, i)=>{
         res[i] = el.name
      })
      if(set.levels != undefined){
         setsList[i].classList.remove('active')
         var activeLevel
         set.levels.sort((a, b) => parseInt(a.label) > parseInt(b.label) ? 1 : -1).forEach(level=>{
            if(res.length >= level.required){
               set.tippyInstance[0].setContent("Active")
               setsList[i].classList.add('active')
               activeLevel = level.label
            }
         })
         setsList[i].textContent = `${setsList[i].dataset.name} ${activeLevel ? `(${activeLevel})` : ''}` 
      }else if(res.length == set.fragments.length){
         setsList[i].textContent = setsList[i].dataset.name
         setsList[i].classList.add('active')
      }else{
         setsList[i].textContent = setsList[i].dataset.name
         setsList[i].classList.remove('active')
      }
      var instanceContent = ''
      set.fragments.forEach(fragment=>{
         instanceContent += res.indexOf(fragment) == -1 ? `<span style="font-size:1rem!important;display: block;color: red">${fragment}</span>` : `<span style="font-size:1rem!important;display: block;color: green">${fragment}</span>`
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