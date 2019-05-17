let conn = require('./db');

class Pagination{
    constructor(query,params = [],itemsPage =10){
        this.query = query;
        this.params = params;
        this.itemsPage = itemsPage;
        this.currentPage;
        this.data;
        this.total;
        this.totalPages;
    }
    getPage(page){
        this.currentPage = page -1;

        this.params.push(
            this.currentPage*this.itemsPage,
            this.itemsPage
        );


        return new Promise((resolve, reject) => {
            conn.query([this.query,'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';')
                ,this.params,(err, results) => {
                if (err) {
                    reject(err);
                }else{
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil( this.total/this.itemsPage);
                    this.currentPage++;

                    resolve(this.data);
                }
            });
        });
    }
    getTotal(){
        return this.total;
    }
    getCurrentPage(){
        return this.currentPage;
    }
    getTotalPages(){
        return this.totalPages;
    }
    getQuaryString(params){
        let queryString = [];
        for(let name in params){
            queryString.push(`${name}=${params[name]}`);
        }
        return queryString.join("&");
    }

    getNavigation(params){
        let limitPagesNav = 5;
        let links = [];
        let nrstart = 0;
        let nrend  = 0;

        if(this.getTotalPages()<limitPagesNav){
            limitPagesNav = this.getTotalPages();
        }
        // Se estamos nas primeiras páginas 
        if((this.getCurrentPage() - parseInt(limitPagesNav/2)) < 1 ){
            nrstart = 1;
            nrend = limitPagesNav;
        }else if((this.getCurrentPage() + parseInt(limitPagesNav/2)) > this.getTotalPages()){
            // Estamos chegando nas últimas páginas
            nrstart = this.getTotalPages() - limitPagesNav;
            if(nrstart === 0) nrstart = 1;
            nrend = this.getTotalPages();
        }else{
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav/2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav/2);
        }
        if(this.getCurrentPage()>1){
            links.push({
                text:'<',
                href:'?' + this.getQuaryString(
                    Object.assign({},params,{page:this.getCurrentPage()-1}))
            });
        }

        for (let x = nrstart; x<= nrend; x++){
            links.push({
                text:x,
                href:'?' + this.getQuaryString(
                    Object.assign({},params,{page:x})
                ),
                active: (x === this.getCurrentPage())
            });
        }

        if(this.getCurrentPage() < this.getTotalPages()){
            links.push({
                text:'>',
                href:'?' + this.getQuaryString(
                    Object.assign({},params,{page:this.getCurrentPage()+1}))
            });
        }
        return links;

    }

}

module.exports = Pagination;