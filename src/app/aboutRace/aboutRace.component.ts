import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'aboutRace',
    styleUrls: ['aboutRace.scss'],
    templateUrl: 'aboutRace.html',
    encapsulation: ViewEncapsulation.None
})

export class AboutRaceComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    func1(e) {
        var $this = $(this);
        console.log("func1-1");
        if (!$this.hasClass('panel-collapsed')) {
            console.log("func1-2");
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        } else {
            console.log("func1-3");
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    }
    func2(e) {
        var $this = $(this);
        console.log("func2-1");
        if ($('#minim_chat_window').hasClass('panel-collapsed')) {
            console.log("func2-2");
            $this.parents('.panel').find('.panel-body').slideDown();
            $('#minim_chat_window').removeClass('panel-collapsed');
            $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    }

    func3(e) {
        var size = $(".chat-window:last-child").css("margin-left");
        var size_total = parseInt(size) + 400;
        alert(size_total);
        var clone = $("#chat_window_1").clone().appendTo(".container");
        clone.css("margin-left", size_total);
    }

    func4(e) {
        $("#chat_window_1").remove();
    }

}






