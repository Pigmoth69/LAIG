function Initials() {

    this.frustum = {near: 0,
                    far: 0};
    this.translateMatrix = mat4.create();
    this.rotateMatrix = mat4.create();
    this.scaleMatrix = mat4.create();
    this.transformationMatrix = mat4.create();
    mat4.identity(this.transformationMatrix);
    
    this.referenceLength = 0;
};

SceneInitials.prototype = Object.create(Object.prototype);
SceneInitials.prototype.constructor = SceneInitials;

<INITIALS>
    <frustum near="ff" far="ff"/>                      <!-- frustum planes-->
    <translation x="ff" y="ff" z="ff" />                 <!-- initial translate -->
    <rotation axis="cc" angle="ff" />                  <!-- initial rotation 3 -->
    <rotation axis="cc" angle="ff" />                  <!-- initial rotation 2 -->
    <rotation axis="cc" angle="ff" />                  <!-- initial rotation 1 -->
    <scale sx="ff" sy="ff" sz="ff" />                  <!-- initial scaling -->
    <reference length="ff" />                          <!-- axis length; "0" means no axis-->
</INITIALS>
