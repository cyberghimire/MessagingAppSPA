import { Pipe, PipeTransform } from "@angular/core";
import { TimeAgoPipe } from "time-ago-pipe";

@Pipe({
    name: "timeAgo", 
    pure: false
})
export class TimeAgoPipeExtended extends TimeAgoPipe implements PipeTransform{
    transform(value: any): string {
        return super.transform(value);
      }
}