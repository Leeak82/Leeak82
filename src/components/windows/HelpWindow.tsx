export function HelpWindow() {
  return (
    <div className="help">
      <h4>How a job works</h4>
      <p>
        Every job follows real shop flow: it starts as a <b>Repair Order</b> with a customer
        complaint, and finishes when you complete the correct repair and fill out the{" "}
        <b>Work Order</b> to standard.
      </p>

      <h4>1. Open the Repair Order</h4>
      <p>Pick a job in the Garage. Read the customer concern and requested service.</p>

      <h4>2. Diagnose &amp; repair in the Service Bay</h4>
      <p>
        Work through each step in order. Steps that need a tool won't run until you select the
        correct one in the <b>Tools</b> window. Diagnostic steps (scan tool, multimeter, load
        tester) reveal findings you'll need later.
      </p>

      <h4>3. Torque to spec</h4>
      <p>
        Torque steps require a value within the OEM tolerance. Under- or over-torquing is
        rejected — dial it in like the real thing.
      </p>

      <h4>4. Complete the Work Order</h4>
      <p>
        Document the 3 C's (Complaint, Cause, Correction), select the correct parts and labor
        hours, complete the checklist, and sign off. Correct work earns <b>XP</b> and levels you
        up.
      </p>

      <h4>Tips</h4>
      <p>
        Use the <kbd>🔧</kbd> button to toggle the tool menu. Windows are movable and resizable —
        arrange your bench however you like.
      </p>
    </div>
  );
}
