import * as PIXI from "pixi.js";

/**
 * Class to model a water quality parameter.
 *
 * @param name - Display name of the parameter.
 * @param key - Given key of the parameter in the NN-model.
 * @param value - Initial value of the parameter.
 * @param increment - The increment with which the value changes.
 * @param minValue - Minimum value the parameter can be (default 0)
 * @param maxValue - Maximum value the parameter can be (default 100)
 * @param optimalMinValue - Minimum value that is considered 'optimal' (default 40)
 * @param optimalMaxValue - Maximum value that is considered 'optimal' (default 60)
 *
 * @example Initializing new Parameter
 * ```ts
 *new WaterParam("Parameter A", "parameter_a", 10, 1, 0, 100, 40, 60);
 *new WaterParam("Parameter B", "parameter_b", 10, 1);
 *```
 */
export class WaterParam extends PIXI.Container {
  // logic fields
  private _name: string; // displayname of parameter
  private _keyName: string; // name of parameter in model
  private _value: number; // initial value of parameter
  private _increment: number; // value with which to change the param's value per step (*1)
  private _minValue: number; // minimum value this parameter can be.
  private _maxValue: number; // maximum value (inclusive) this parameter can be.
  private _optimalMinValue: number; // minimum value for the optimal values range.
  private _optimalMaxValue: number; // maximum value for the optimal values range.
  // drawing fields
  private bgRect: PIXI.Graphics;
  private optimalRect: PIXI.Graphics;
  private valueIndicator: PIXI.Graphics;
  private nameText: PIXI.Text;
  private textMargin: number;
  private rectRadius: number;

  constructor(
    name: string,
    keyName: string,
    value: number,
    increment: number,
    minValue: number = 0,
    maxValue: number = 100,
    optimalMinValue: number = 40,
    optimalMaxValue: number = 60
  ) {
    super();

    this._name = name;
    this._keyName = keyName;
    this._increment = increment;

    // fields set via setters
    this.value = value;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.optimalMinValue = optimalMinValue;
    this.optimalMaxValue = optimalMaxValue;

    // drawing related
    this.rectRadius = 20;
    this.textMargin = 10;
    this.visible = false;
    this.bgRect = new PIXI.Graphics();
    this.valueIndicator = new PIXI.Graphics();
    this.optimalRect = new PIXI.Graphics();
    this.nameText = new PIXI.Text(this.name);
    this.addChild(
      this.bgRect,
      this.optimalRect,
      this.valueIndicator,
      this.nameText
    );

    console.log(
      `WaterParam created: ${this.name} (${this.keyName}), value: ${this.value}, increment: ${this.increment}`
    );
  }

  // getters and setters
  public get name() {
    return this._name;
  }

  public get keyName() {
    return this._keyName;
  }

  public get value() {
    return this._value;
  }

  /**
   * Setter for the parameter's value.
   * Enforces parameter's set range. Where value gets set to the minimum/maximum value when out of range.
   *
   * @param newValue - new value to set the parameter's value to.
   *
   * @example
   * ```ts
   * this.value = newValue;
   * this.value = 20;
   * ```
   */
  private set value(newValue: number) {
    const range = this.range;
    if (newValue < range.min || newValue > range.max) {
      console.log(
        `${newValue} is outside of allowed range. ${range.min}-${range.max}`
      );
      if (newValue < range.min) {
        this._value = range.min;
        console.log(`set to minimum instead : ${range.min} | ${this.value}`);
      } else {
        this._value = range.max;
        console.log(`set to maximum instead : ${range.max} | ${this.value}`);
      }
    } else {
      this._value = newValue;
      console.log(`changed ${this.name}'s value. ${newValue} | ${this.value}`);
    }
  }

  public get increment() {
    return this._increment;
  }

  public get range() {
    return {
      min: this.minValue,
      max: this.maxValue,
    };
  }

  private get minValue() {
    return this._minValue;
  }

  /**
   * Setter for the parameter's minValue.
   * Enforces a minimum value of 0.
   *
   * @param value - value to set minValue to.
   *
   * @example
   * ```ts
   * this.minValue = 0;
   * ```
   */
  private set minValue(value: number) {
    if (value < 0) {
      console.log(`ERROR: minValue cant be below 0. value:${value}`);
    } else {
      this._minValue = value;
    }
  }

  private get maxValue() {
    return this._maxValue;
  }

  /**
   * Setter for the parameter's maxValue.
   * Enforces a minimum value above the parameter's minValue.
   *
   * @param value - value to set maxValue to.
   *
   * @example
   * ```ts
   * this.maxValue = 5;
   * ```
   */
  private set maxValue(value: number) {
    if (value < this.minValue) {
      console.log(
        `ERROR: maxValue cant be below minValue(${this.minValue}). value: ${value}`
      );
    } else {
      this._maxValue = value;
    }
  }

  public get optimalRange() {
    return {
      min: this.optimalMinValue,
      max: this.optimalMaxValue,
    };
  }

  private get optimalMinValue() {
    return this._optimalMinValue;
  }

  /**
   * Setter for the parameter's optimal Minimum Value.
   * Enforces a minimum value above the parameter's minValue, and below the parameter's maxValue.
   *
   * @param value - value to set optimalMinValue to.
   *
   * @example
   * ```ts
   * this.maxValue = 2;
   * ```
   */
  private set optimalMinValue(value: number) {
    if (value > this.minValue && value < this.maxValue) {
      this._optimalMinValue = value;
    } else {
      console.log(
        `ERROR: optimalMinValue must be between ${this.range.min} - ${this.range.max}. value: ${value}`
      );
    }
  }

  private get optimalMaxValue() {
    return this._optimalMaxValue;
  }

  /**
   * Setter for the parameter's optimal Maximum Value.
   * Enforces a minimum value above the parameter's optimalMinValue, and below the parameter's maxValue.
   *
   * @param value - value to set optimalMaxValue to.
   *
   * @example
   * ```ts
   * this.maxValue = 4;
   * ```
   */
  private set optimalMaxValue(value: number) {
    if (value > this.optimalMinValue && value < this.maxValue) {
      this._optimalMaxValue = value;
    } else {
      console.log(
        `ERROR: optimalMaxValue must be between ${this.optimalMinValue} - ${this.maxValue}. value: ${value}`
      );
    }
  }

  /**
   * function to update the parameter's value.
   * step is multiplied with parameter's increment value and then added to value.
   *
   * @param step number in range -5 to 5 inclusive.
   *
   */
  public updateValue(step: number) {
    if (step != null && step >= -5 && step <= 5) {
      console.log(`old: ${this.value} | step: ${step}`);
      const tempValue = this.value + this.increment * step;
      this.value = tempValue;
      const change = this.increment * step;
      this.updateDraw(change);
    } else {
      console.log(
        `Could not update value of ${this.name}. Invalid step value. (range: -5 - 5, given: ${step})`
      );
    }
  }

  //drawing functions

  /**
   * function draw the parameter's value onto the screen, in bar form.
   * Comes with a background, optimal value range, and value indicator.
   *
   * @param x - X-coordinate of the top-left corner of the bar.
   * @param y - Y-coordinate of the top-left corner of the bar.
   * @param height - Height of the bar
   * @param width - width of the bar
   *
   */
  public draw(x: number, y: number, height: number, width: number) {
    this.visible = true;
    // draw text and place it on the screen
    const widthText = width * 0.3;
    const widthBar = width * 0.7;

    this.nameText.anchor.set(0.5, 0);
    this.nameText.x = widthText / 2;
    this.nameText.y = y;
    this.nameText.height = height;
    this.nameText.width = width * 0.2;

    this.bgRect.beginFill("rgba(255,215,0)");
    this.bgRect.lineStyle({
      width: 2,
      color: "rgba(160,82,45)",
      alignment: 0.5,
    });
    this.bgRect.drawRoundedRect(
      widthText,
      y,
      widthBar,
      height,
      this.rectRadius
    );
    this.bgRect.endFill();

    //draw optimal range indicators
    this.optimalRect.beginFill("rgba(50,205,50, 0.2)");
    this.optimalRect.lineStyle({
      width: 2,
      color: "rgba(50,205,50)",
    });

    // optimalX is the x-coordinate for the optimal range indicator.
    const optimalX: number =
      widthText +
      widthBar *
        ((this.optimalRange.min - this.range.min) /
          (this.range.max - this.range.min));
    // optimalWidth is the width of the optimal range indicator
    const optimalWidth: number =
      widthBar *
      ((this.optimalRange.max - this.optimalRange.min) /
        (this.range.max - this.range.min));

    // log values
    console.log(
      `X: ${x}, OptimalX: ${optimalX}, Width: ${width}, OptimalWidth: ${optimalWidth}`
    );

    // decide if it's supposed to be visible based on values
    if (Number.isNaN(optimalX) && Number.isNaN(optimalWidth)) {
      console.log(`ERROR: optimalRect can't be drawn due to NaN errors.`);
      this.optimalRect.visible = false;
    } else {
      this.optimalRect.drawRect(optimalX, y, optimalWidth, height);
      this.optimalRect.visible = true;
    }

    // draw / update value indicator
    this.valueIndicator.beginFill("rgba(0, 255, 255, 0.1)");
    this.valueIndicator.lineStyle({
      width: 1,
      color: "rgba(8, 24, 168, 1)",
      alignment: 0.5,
    });

    const valueX =
      this.value > height / 2
        ? widthText +
          widthBar * (this.value / (this.range.max - this.range.min))
        : widthText + height / 2;
    this.valueIndicator.drawCircle(valueX, y + height / 2, height / 2);
  }

  public updateDraw(change: number) {
    const newX =
      this.valueIndicator.x +
      this.bgRect.width * (change / (this.range.max - this.range.min));
    console.log(change, newX);
    if (newX > this.bgRect.x + this.bgRect.width) {
      this.valueIndicator.x =
        this.bgRect.x + this.bgRect.width - this.valueIndicator.height / 0.7;
    } else if (newX < this.bgRect.x + this.valueIndicator.height / 2) {
      this.valueIndicator.x = this.bgRect.x + this.valueIndicator.height / 2;
    } else {
      this.valueIndicator.x +=
        this.bgRect.width * (change / (this.range.max - this.range.min));
    }
  }
}
