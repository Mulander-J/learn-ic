import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

/*fibonaci*/

func fib(n:Nat):Nat{
    if(n<=1) 1:Nat
    else fib(n-2)+fib(n-1)
};
Debug.print(Nat.toText(fib(10)));

/*qucikSort*/

func sort(arr:[var Int],low:Nat,high:Nat){
    if(low>=high) return;
    var pivot = arr[low];
    var left = low;
    var right = high;
    while(left < right){
        while(arr[right] >= pivot and right > left){
            right -= 1;
        };
        arr[left] := arr[right];
        while(arr[left] <= pivot and left < right){
            left += 1;
        };
        arr[right] := arr[left];
    };
    arr[right] := pivot;
    if(left >= 1) sort(arr,low,left-1);
    sort(arr,left+1,high);
};


var newArr:[var Int] = [var 1,2,8,4,2];
sort(newArr,0,newArr.size()-1);

for(n in newArr.vals()){
  Debug.print(Int.toText(n))
};