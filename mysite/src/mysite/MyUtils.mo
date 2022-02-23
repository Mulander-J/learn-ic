import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

module MyUtils {
  public func fib(n:Nat):Nat{
    if(n<=1) 1:Nat
    else fib(n-2)+fib(n-1)
  }; 
  
  public func qSort(arr:[Int]): [Int] {
    //  Transform an immutable array into a mutable array.
    var newArr:[var Int] = Array.thaw(arr);
    //  Execute Sort
    sort(newArr,0,newArr.size()-1);
    //  Transform mutable array into immutable array
    Array.freeze(newArr)
  }; 

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
};