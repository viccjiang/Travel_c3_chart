const url = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json'
let data = []

// 選取 dom
const ticketCard = document.querySelector('.ticketCard-area')
const addCardBtn = document.querySelector('.addTicket-btn');
const ticketName = document.querySelector('#ticketName')
const imgUrl = document.querySelector('#ticketImgUrl')
const area = document.querySelector('#ticketRegion')
const price = document.querySelector('#ticketPrice')
const group = document.querySelector('#ticketNum')
const rate = document.querySelector('#ticketRate')
const description = document.querySelector('#ticketDescription')
const searchResultNum = document.querySelector('#searchResult-text')



axios.get(url)
  .then(function (response) {
    data = response.data.data
    console.log(data);
    renderC3(); // 先把資料組出來
    renderCard(); // 再渲染列表
  })

function renderC3(){
    // 篩選地區，並累加數字上去
    // totalObj 會變成 {高雄: 1, 台北: 1, 台中: 1}
    let dataObj ={};
    data.forEach((item)=>{
      if(dataObj[item.area]===undefined){
        dataObj[item.area] =1
      }else{
        dataObj[item.area] +=1
      }
    })
    console.log(dataObj); // {高雄: 1, 台北: 1, 台中: 1}

    let area = Object.entries(dataObj)
    console.log(area);

    const chart = c3.generate({
      bindto: "#chart",
      size: {
        height: 160,
        weight: 160
      },
      data: {
        columns: area,
        type: "donut",
        colors: {
          高雄: "#E68618",
          台北: "#26C0C7",
          台中: "#5151D3"
        }
      },
      donut: {
        title: "套票地區比重",
        label: {
          show: false
        }
      }
    });
    
}

// 卡片渲染
function renderCard(area) {
  let str = ''
  const filterArea = data.filter(item => {
    if (area === item.area) {
      return item;
    }

    if (area === "全部地區") { // 地區搜尋全部地區時
      return item;
    }

    if (!area) {
      return item
    }
  });
  filterArea.forEach(item => {
    str += `<li class="ticketCard">
    <div class="ticketCard-img">
      <a href="#">
        <img src="${item.imgUrl}" alt="">
      </a>
      <div class="ticketCard-region">${item.area}</div>
      <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
      <div>
        <h3>
          <a href="#" class="ticketCard-name">${item.name}</a>
        </h3>
        <p class="ticketCard-description">
          ${item.description}
        </p>
      </div>
      <div class="ticketCard-info">
        <div class="ticketCard-num">
          <p>
            <span><i class="fas fa-exclamation-circle"></i></span>
            剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
          </p>
        </div>
        <p class="ticketCard-price">
          TWD <span id="ticketCard-price">${item.price}</span>
        </p>
      </div>
    </div>
  </li>`
  });
  ticketCard.innerHTML = str;
  searchNum(filterArea);
}

// 新增套票
addCardBtn.addEventListener('click', addCard);
function addCard() {
  let obj = {
    id: Date.now(),
    name: ticketName.value,
    imgUrl: imgUrl.value,
    area: area.value,
    price: Number(price.value),
    group: Number(group.value),
    rate: Number(rate.value),
    description: description.value,
  }

  data.push(obj)

  const form = document.querySelector('.addTicket-form')
  form.reset();
  regionSearch.value = "全部地區";
  renderC3();
  renderCard();

}

// 篩選
const regionSearch = document.querySelector('.regionSearch')
regionSearch.addEventListener('change', regionFilter)
function regionFilter(e) {
  const regionSelect = regionSearch.value
  console.log(regionSelect);
  renderCard(regionSelect)
}

// 本次搜尋共 ? 筆資料
function searchNum(search) {
  const dataNum = search.length
  let str = `本次搜尋共 ${dataNum} 筆資料`
  searchResultNum.innerHTML = str
}

// 執行渲染
renderCard()