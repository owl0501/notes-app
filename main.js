let count=0;

const lsNotes=JSON.parse(localStorage.getItem('notes'));
if(lsNotes){
    console.log(true);
    lsNotes.forEach(function(item,index){
        addNewNote(text=item,45*index,45*index);
    });
}
else{
    addNewNote();
}

function addNewNote(text='',locX=null,locY=null){
    // console.log(text);
    const note=document.createElement('div');
    note.classList.add('notes');
    note.innerHTML=`
        <div class="tools">
        <button id="btn-add" class="btn-base">
            <i class="fas fa-plus"></i>
        </button>
        <div class="drag-point">
                    
        </div>
        <div class="right-btn-group">
            <button id="btn-edit" class="btn-base">
                <i class="fas fa-edit"></i>
            </button>
            <button id="btn-delete"class="btn-base">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        </div>
        <div class="main ${text?'':'hidden'}"></div>
        <textarea class="content ${text?'hidden':''}"></textarea>
    `;
    const main=note.querySelector('.main');
    const textArea=note.querySelector('textarea');
    
    const btn_edit=note.querySelector('#btn-edit');
    btn_edit.addEventListener('click',function(){
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');    
    });

    //輸入事件
    textArea.value=text;
    main.innerHTML=marked(text);
    textArea.addEventListener('input',function(ev){
        const {value}=ev.target;
        // const content=ev.target.value;
        // console.log(value,content);
        main.innerHTML=marked(value);
        updateLS();
    });
    //新增
    const btn_add=note.querySelector('#btn-add');
    btn_add.addEventListener('click',function(ev){
        addNewNote('',ev.clientX,ev.clientY);
    });
    //刪除
    const btn_delete=note.querySelector('#btn-delete');
    btn_delete.addEventListener('click',function(){
        if(count>1){
            count--;
            note.remove();
            updateLS();
        }
        console.log('張數:',count);
    });

    count++;
    console.log('張數:',count);

    //拖曳
    const dragPoint=note.querySelector('.drag-point');
    drag(note,dragPoint);
    document.body.appendChild(note);
    if(text){
        note.style.left=note.offsetLeft+locX+'px';
        note.style.top=note.offsetTop+locY+'px';
    }
    else{
        note.style.left=locX+20+'px';
        note.style.top=locY+20+'px';
    }
}

//更新LocalStorage
function updateLS(){
    const notesText=document.querySelectorAll('textarea');
    let notes=[];
    notesText.forEach(function(item){
        notes.push(item.value);
    });

    localStorage.setItem('notes',JSON.stringify(notes));
}


//拖曳
function drag(oDrag, handle) {
    let disX = dixY = 0;
    handle = handle || oDrag;
    handle.style.cursor = "move";
    handle.onmousedown = function (ev_md) {
        let event = ev_md || window.event;
        //以視窗座標計算
        disX = event.clientX - oDrag.offsetLeft;
        disY = event.clientY - oDrag.offsetTop;
        // console.log('初始差(元件-視窗):',oDrag.offsetLeft,oDrag.offsetTop);
        console.log('(元件邊緣--滑鼠位置)差:',disX,disY);
        document.onmousemove = function (ev_mm) {
            let event = ev_mm || window.event;
            let moveLeft = event.clientX - disX;
            let moveTop = event.clientY - disY;
            console.log('移動差(元件邊緣位置):',moveLeft,moveTop);

            // console.log('視窗大小:',document.documentElement.clientWidth,document.documentElement.clientHeight);
            let maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
            let maxT = document.documentElement.clientHeight - oDrag.ffsetHeight;
            // console.log('可移動範圍:',maxL,maxT);
            
            //防止超出邊界
            //&&仿if特性 若moveLeft 0為true執行(moveLeft0)
            moveLeft <=0 && (moveLeft=0);
            moveTop <= 0 && (moveTop = 0);
            console.log('1',moveLeft,moveTop);
            moveLeft>= maxL && (moveLeft=maxL);
            moveTop >= maxT && (moveTop = maxT);
            
            console.log('2',moveLeft,moveTop);

            oDrag.style.left = moveLeft+"px";
            oDrag.style.top = moveTop+ "px";

            //阻止預設動作
            return false
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            this.releaseCapture && this.releaseCapture()
        };
        this.setCapture && this.setCapture();
        //阻止預設動作
        return false
    };
}