describe("jasmine messing around", function()
{
   it("strict inequality", function()
   {
       expect(true).toBe(true);
       expect(false).toBe(false);
   });
});

describe("global scope", function()
{
   var obj = {};
   obj.prop = 0;
   
   it("starts at 0", function()
   {
       expect(obj.prop).toBe(0);
   });
   
   it("increments prop by 1 every time", function()
   {
      var before, after, delta;
      
      before = obj.prop;
      obj.prop++;
      after = obj.prop;
      delta = after - before;
      
      expect(delta).toBe(1); 
   });
   
   it("increments prop by 1 every time", function()
   {
      var before, after, delta;
      
      before = obj.prop;
      obj.prop++;
      after = obj.prop;
      delta = after - before;
      
      expect(delta).toBe(1); 
   });
   
});

describe("spoopy spies", function()
{
   var obj = {};
   obj.Method = function()
   {
       
   };
   
   beforeEach(function()
   {
        spyOn(obj, "Method");    
   });
   
   it("checking the call", function()
   {
       obj.Method("arg1", "arg2", 0);
       expect(obj.Method).toHaveBeenCalled();
   });
   
});