import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

constructor(private router : Router) {}
 

ngOnInit(): void {


}

doSearch(value : string) { 

  console.log("dosearch method search comp");
  console.log(`value=${value}`);
  this.router.navigateByUrl(`/search/${value}`);
// we will call route search 
//{path: 'search/keyword' : component : ProductListComponent}
// sending data to the search route

}


}
