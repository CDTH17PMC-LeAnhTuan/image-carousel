let dataList = [];
const FetchData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos?_start=0&_limit=1000')
    const data = await response.json();
    dataList = data;
    console.log(dataList);
}

const appendDataImage = () => {
    let source = $("#pagination").html();
    let template = Handlebars.compile(source);
    $("#itemContainer").append(template(dataList));
}
const InitCall = async () => {
    await FetchData();
    appendDataImage();

    $("div.holder").jPages({
        containerID: "itemContainer",
        perPage: 10
    });
    $("select").change(function () {
        let newPerPage = parseInt($(this).val());
        $("div.holder").jPages("destroy").jPages({
            containerID: "itemContainer",
            perPage: newPerPage
        });
    });
}
InitCall();
