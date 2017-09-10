import { Component ,AfterViewInit, ElementRef} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'questions',
    styleUrls:['./questions.component.scss'],
    templateUrl: './questions.component.html',
})
export class QuestionsComponent implements AfterViewInit{

    constructor(private el: ElementRef,private router: Router) {
        if(!sessionStorage.getItem('username_id')){
            this.router.navigate(['./login']);
        }
    }

    ngAfterViewInit(){
        //this.router.navigate(['/questions/related']);
    }
    
};