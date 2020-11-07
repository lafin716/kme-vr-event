
// VR 객체
vrObj = document.getElementById('pdtViewer');

// VR 최대 크기 사이즈 기준
var default_vr_maximum_width = 1500;

// 모바일 레이아웃 사이즈 기준
var default_mobile_width = 1250;


// 리사이징 이벤트
window.addEventListener('resize', function(event){
    setButtonPosition();
});

// 페이지 로드 완료 시
document.addEventListener('DOMContentLoaded', function(event){
    init();
});

function init(){
    setViewer();
    setButtonPosition();
    setButtonEvent();
}

// PC 버전일 때 화면 크기에 맞춰 VR에 맞추기 위해 버튼 리사이징
function setVRResize(){
    if(!useVR) return false;

    // 모바일 기준 사이즈 이상이고 VR 최대크기 이하일 때만 리사이징
    if(window.innerWidth > default_mobile_width && window.innerWidth < default_vr_maximum_width){        

        // 창 사이즈와 VR 사이즈 차이값
        window_difference = (default_vr_maximum_width - window.innerWidth) / 2;
        vrObj.setAttribute('style','transform:translateX(-'+window_difference+'px)');
    }else{
        vrObj.setAttribute('style','transform:unset');
    }
}

function setButtonPosition(){
    if(spotInfo.length == 0) return false;

    for(var index in spotInfo){
        spotPosition = spotInfo[index];
        spotObj = document.getElementById(index);

        // 모바일 기준 사이즈 이상 일 때만 웹용으로 위치 조정
        if(window.innerWidth > default_mobile_width){
            spotObj.style.top = spotPosition[1];
            spotObj.style.left = spotPosition[0];
        }else{
            spotObj.style.top = null;
            spotObj.style.left = null;
        }
    }
}

function setButtonEvent(){
    btn_quick_list = document.querySelectorAll('.ly-quick-access .nav-header');

    for(var i = 0; i < btn_quick_list.length; i++){
        btn_quick = btn_quick_list[i];

        btn_quick.addEventListener('click', function(e){
            this.classList.toggle('active');
            header_icon = this.querySelector('.icon');
            header_icon.classList.toggle('fa-angle-up');
            header_icon.classList.toggle('fa-angle-down');

            parent_obj = this.closest('.ly-quick-access');
            content = parent_obj.querySelector('.nav-content');
            content.classList.toggle('hide');
        });
    }

}

function setViewer(){
    if(!useVR) return false;
    VR_Viewer(vr_options);
}