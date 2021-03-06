/* ellie/processor/mode.js
 *
 * Modes, or Addressing Modes, are intended to reduce
 * some of the upkeep on running operations. Operations
 * are intended to be written in a generic way. It is
 * the job of the specific Mode to do the leg work,
 * such as moving data to the ALU, or moving data afterwards
 * to the appropriate memory/registers. All grouped opcodes
 * should use the same core method, where the mode varients
 * change the 'inputs' or 'outputs', so to speak.
 *
 * Example: The AND operation ANDs the accumulator with another
 * register. Depending on the mode, this could be a register
 * within the processor, a memory address, or an immediate integer.
 * The *only* job of the operator is to execute the AND and
 * return the result. It is the job of a mode to set the other
 * input register via before() and store the result from
 * the output register via after(). Since a processor's
 * instruction set often has many operations with similar
 * addressing modes, this makes the mode reusable across
 * operations and minimizes the complexity of the operation
 * itself.
 */

function* doNothing() {
  return true; // halt if not true
} // doNothing

function Mode(name, description, before=doNothing, after=doNothing) {
  this.description   = description;
  this.name          = name;
  this.beforeExecuteTick = before; // runs before Operation.execute()
  this.afterExecuteTick  = after; // runs after Operation.execute()
  return this;
} // Processor.Mode()

Mode.prototype.beforeExecute = function() {
  let runner = this.beforeExecuteTick.apply(this, arguments);
  let ret    = runner.next();
  while (ret.done !== true) {
    ret = runner.next();
  } // while not done
  return ret.value;
}; // Mode.prototype.beforeExecute

Mode.prototype.afterExecute = function() {
  let runner = this.afterExecuteTick.apply(this, arguments);
  let ret    = runner.next();
  while (ret.done !== true) {
    ret = runner.next();
  } // while not done
  return ret.value;
}; // Mode.prototype.afterExecute

module.exports = Mode;
