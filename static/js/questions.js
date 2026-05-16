// ═══════════════════════════════════════════════════════════════
//  BioMed OOP Lab — Question Definitions
// ═══════════════════════════════════════════════════════════════

const QUESTIONS = {
  q1: {
    id:'q1', icon:'💉', title:'Smart Insulin Delivery System', totalMarks:25,
    concepts:['Abstract Classes','Inheritance','Polymorphism','Encapsulation','Exception Handling'],
    htmlContent:`
      <h3>Scenario</h3>
      <p>In this lab, you'll design an OOP-based simulation for a <strong>smart insulin pump system</strong> used in diabetes management. The system tracks glucose readings, calculates insulin doses, and monitors device battery and reservoir levels.</p>

      <h3>Objective</h3>
      <p>Fulfill the user stories below and get all the tests to pass to complete the lab.</p>

      <h3>User Stories</h3>

      <h4><span class="part-label">Part a</span> Abstract Base Class — MedicalDevice <span class="marks-badge">5 marks</span></h4>
      <p>Create an abstract base class named <code>MedicalDevice</code> using Python's <code>abc</code> module.</p>
      <ul>
        <li>Import <code>ABC</code> and <code>abstractmethod</code> from the <code>abc</code> module at the top of your file.</li>
        <li>When instantiated, <code>MedicalDevice</code> should accept <code>device_id</code> (string) and an optional <code>battery_level</code> (float, default <code>100.0</code>).</li>
        <li>Set <code>self.device_id</code> to the given device ID string.</li>
        <li>Set <code>self.status</code> to the string <code>"active"</code>.</li>
        <li>Store the battery level privately as <code>self._battery_level</code>.</li>
        <li>Create a <code>battery_level</code> property (getter) that returns <code>self._battery_level</code>.</li>
        <li>Create a <code>battery_level</code> setter decorated with <code>@battery_level.setter</code> that raises <code>ValueError</code> if the value is outside the range 0–100; otherwise sets <code>self._battery_level</code> to the value.</li>
        <li>Define a <code>check_battery()</code> method that returns a descriptive string: <code>"Battery OK"</code> if above 50%, <code>"Battery LOW"</code> if above 20%, or <code>"Battery CRITICAL"</code> otherwise — each prefixed with the device ID.</li>
        <li>Define <code>deliver_therapy(patient_data)</code> decorated with <code>@abstractmethod</code> so that subclasses must implement it.</li>
      </ul>

      <h4><span class="part-label">Part b</span> InsulinPump Subclass <span class="marks-badge">6 marks</span></h4>
      <p>Create a class <code>InsulinPump</code> that inherits from <code>MedicalDevice</code> and represents a wearable insulin pump.</p>
      <ul>
        <li>Its <code>__init__</code> should accept <code>device_id</code>, <code>insulin_reservoir</code> (float, ml), and <code>basal_rate</code> (float, units/hr). Call <code>super().__init__(device_id)</code>.</li>
        <li>Store the reservoir privately as <code>self._insulin_reservoir</code> and create a <code>insulin_reservoir</code> property (getter) that returns it.</li>
        <li>Set <code>self.basal_rate</code> and initialise <code>self.bolus_history</code> as an empty list.</li>
        <li>Implement <code>deliver_therapy(patient_data)</code>: read <code>glucose</code> from the dict (default 100). If glucose &gt; 140, compute <code>bolus = (glucose - 100) / 50</code>; otherwise bolus is 0. Set <code>total = basal_rate + bolus</code> (capped at remaining reservoir). Subtract <code>total</code> from the reservoir and subtract 0.5 from battery. Append a dict with keys <code>"glucose"</code>, <code>"bolus"</code>, and <code>"total"</code> to <code>bolus_history</code>. Print a delivery confirmation line.</li>
      </ul>

      <h4><span class="part-label">Part c</span> GlucoseMonitor Subclass &amp; Polymorphism <span class="marks-badge">4 marks</span></h4>
      <p>Create a class <code>GlucoseMonitor</code> that inherits from <code>MedicalDevice</code>. This device only reads and logs glucose; it does not deliver insulin.</p>
      <ul>
        <li>Its <code>__init__</code> should accept <code>device_id</code>. Call <code>super().__init__(device_id)</code> and initialise <code>self.glucose_log = []</code>.</li>
        <li>Implement <code>deliver_therapy(patient_data)</code>: read the glucose value, append it to <code>glucose_log</code>, classify it as <code>"HIGH"</code> (above 180), <code>"LOW"</code> (below 70), or <code>"NORMAL"</code>, subtract 0.1 from battery, and print a reading line.</li>
        <li>Demonstrate polymorphism by placing both an <code>InsulinPump</code> and a <code>GlucoseMonitor</code> in a list named <code>devices</code> and calling <code>deliver_therapy()</code> on each in a loop.</li>
      </ul>

      <h4><span class="part-label">Part d</span> Encapsulation &amp; Custom Exceptions <span class="marks-badge">5 marks</span></h4>
      <ul>
        <li>Define a custom exception class <code>LowBatteryError</code> (subclass of <code>Exception</code>). Raise it inside <code>deliver_therapy()</code> when battery drops below 10%.</li>
        <li>Define a custom exception class <code>EmptyReservoirError</code> (subclass of <code>Exception</code>). Raise it inside <code>InsulinPump.deliver_therapy()</code> when the reservoir is ≤ 0.</li>
        <li>Wrap all device calls in the main loop with <code>try/except</code> blocks that catch and print these errors gracefully without crashing the program.</li>
      </ul>

      <h4><span class="part-label">Part e</span> Main Simulation Script <span class="marks-badge">5 marks</span></h4>
      <ul>
        <li>Create an <code>InsulinPump</code> (e.g. ID <code>"PUMP-001"</code>, reservoir 300 ml, basal rate 1.0 u/hr) and a <code>GlucoseMonitor</code> (e.g. ID <code>"MON-001"</code>).</li>
        <li>Generate 5 random glucose readings between 80 and 250 mg/dL using <code>random.randint</code>.</li>
        <li>Loop through all 5 readings, calling <code>deliver_therapy()</code> on each device with error handling.</li>
        <li>After the loop, print a summary report showing the remaining reservoir level and the full bolus history.</li>
      </ul>

      <h3>Usage Example</h3>
      <pre><code>pump    = InsulinPump("PUMP-001", insulin_reservoir=300, basal_rate=1.0)
monitor = GlucoseMonitor("MON-001")

devices  = [pump, monitor]
readings = [120, 180, 95, 210, 140]

print("=== 5-Cycle Therapy Simulation ===")
for i, glucose in enumerate(readings, 1):
    print(f"\\nCycle {i} | Glucose: {glucose} mg/dL")
    for device in devices:
        try:
            device.deliver_therapy({"glucose": glucose})
        except (LowBatteryError, EmptyReservoirError) as e:
            print(f"  ERROR: {e}")

print("\\n=== Summary Report ===")
print(f"Reservoir remaining : {pump.insulin_reservoir:.1f} ml")
print(f"Bolus history       : {pump.bolus_history}")</code></pre>

      <h3>Tests</h3>
      <ol>
        <li>You should import <code>ABC</code> and <code>abstractmethod</code> from the <code>abc</code> module.</li>
        <li>You should have a <code>MedicalDevice</code> class that inherits from <code>ABC</code>.</li>
        <li>The <code>MedicalDevice.__init__</code> should set <code>self.device_id</code>, <code>self.status = "active"</code>, and <code>self._battery_level</code>.</li>
        <li>You should have a <code>battery_level</code> property (getter) that returns <code>self._battery_level</code>.</li>
        <li>You should have a <code>battery_level</code> setter that raises <code>ValueError</code> for values outside 0–100.</li>
        <li>You should have a <code>check_battery()</code> method that returns a string describing the battery status.</li>
        <li>You should have <code>deliver_therapy</code> decorated with <code>@abstractmethod</code> in <code>MedicalDevice</code>.</li>
        <li>You should have an <code>InsulinPump</code> class that inherits from <code>MedicalDevice</code>.</li>
        <li>The <code>InsulinPump.__init__</code> should set <code>_insulin_reservoir</code>, <code>basal_rate</code>, and <code>bolus_history = []</code>.</li>
        <li>You should have an <code>insulin_reservoir</code> property on <code>InsulinPump</code> that returns <code>self._insulin_reservoir</code>.</li>
        <li>You should implement <code>deliver_therapy()</code> in <code>InsulinPump</code> with glucose-based bolus calculation.</li>
        <li><code>InsulinPump.deliver_therapy()</code> should reduce the reservoir and battery on each call.</li>
        <li><code>InsulinPump.deliver_therapy()</code> should append a record dict to <code>bolus_history</code>.</li>
        <li>You should have a <code>GlucoseMonitor</code> class that inherits from <code>MedicalDevice</code> with a <code>glucose_log</code> attribute.</li>
        <li>You should implement <code>deliver_therapy()</code> in <code>GlucoseMonitor</code> to log and classify glucose readings.</li>
        <li>You should demonstrate polymorphism by calling <code>deliver_therapy()</code> on a list containing both device types.</li>
        <li>You should define a custom exception <code>LowBatteryError</code> that extends <code>Exception</code>.</li>
        <li>You should define a custom exception <code>EmptyReservoirError</code> that extends <code>Exception</code>.</li>
        <li>You should raise <code>LowBatteryError</code> in <code>deliver_therapy()</code> when battery is below 10%.</li>
        <li>You should raise <code>EmptyReservoirError</code> in <code>InsulinPump.deliver_therapy()</code> when the reservoir is empty.</li>
        <li>You should use <code>try/except</code> in the main simulation loop to handle device errors.</li>
        <li>Your main script should simulate exactly 5 therapy cycles using a loop.</li>
        <li>Your main script should print a summary report showing reservoir level and bolus history after the loop.</li>
      </ol>`,
    starterCode:`# Question 1: Smart Insulin Delivery System
from abc import ABC, abstractmethod
import random

# ── Part a ─────────────────────────────────────────────────────
class MedicalDevice(ABC):
    def __init__(self, device_id, battery_level=100.0):
        self.device_id = device_id
        self.status = "active"
        self.battery_level = battery_level  # make private with property!

    def check_battery(self):
        pass  # return descriptive string

    @abstractmethod
    def deliver_therapy(self, patient_data):
        pass


# ── Part b ─────────────────────────────────────────────────────
class InsulinPump(MedicalDevice):
    def __init__(self, device_id, insulin_reservoir, basal_rate):
        super().__init__(device_id)
        self.insulin_reservoir = insulin_reservoir
        self.basal_rate = basal_rate
        self.bolus_history = []

    def deliver_therapy(self, patient_data):
        pass  # glucose > 140 → calculate bolus; reduce reservoir & battery


# ── Part c ─────────────────────────────────────────────────────
class GlucoseMonitor(MedicalDevice):
    def deliver_therapy(self, patient_data):
        pass  # only read & log glucose


# ── Part e: Main Script ────────────────────────────────────────
if __name__ == "__main__":
    pump    = InsulinPump("PUMP-001", insulin_reservoir=300, basal_rate=1.0)
    monitor = GlucoseMonitor("MON-001")
    devices = [pump, monitor]
    readings = [random.randint(80, 250) for _ in range(5)]

    print("=== 5-Cycle Therapy Simulation ===")
    for i, glucose in enumerate(readings, 1):
        print(f"\\nCycle {i} | Glucose: {glucose} mg/dL")
        for device in devices:
            device.deliver_therapy({"glucose": glucose})

    print("\\n=== Summary Report ===")
    print(f"Reservoir remaining : {pump.insulin_reservoir} ml")
    print(f"Bolus history       : {pump.bolus_history}")
`,
    hints:[
      "💡 Import ABC and abstractmethod from abc. Store battery as self._battery_level; create a @property + @setter that raises ValueError outside 0-100. Decorate deliver_therapy with @abstractmethod.",
      "💡 In InsulinPump.deliver_therapy, get glucose = patient_data.get('glucose',100). If glucose > 140, bolus = (glucose-100)/50. Subtract total = basal_rate + bolus from insulin_reservoir and 0.5 from battery_level. Append to bolus_history.",
      "💡 For exceptions: raise a LowBatteryError (subclass Exception) when battery < 10, and EmptyReservoirError when reservoir <= 0. Wrap device calls in try/except in the main loop."
    ],
    solution:`from abc import ABC, abstractmethod
import random

class DeviceError(Exception): pass
class LowBatteryError(DeviceError): pass
class EmptyReservoirError(DeviceError): pass

class MedicalDevice(ABC):
    def __init__(self, device_id, battery_level=100.0):
        self.device_id = device_id
        self.status = "active"
        self._battery_level = battery_level

    @property
    def battery_level(self): return self._battery_level
    @battery_level.setter
    def battery_level(self, val):
        if not (0 <= val <= 100): raise ValueError(f"Battery must be 0-100, got {val}")
        self._battery_level = val

    def check_battery(self):
        b = self._battery_level
        if b > 50:   return f"[{self.device_id}] Battery OK: {b:.1f}%"
        elif b > 20: return f"[{self.device_id}] Battery LOW: {b:.1f}%"
        else:        return f"[{self.device_id}] Battery CRITICAL: {b:.1f}%"

    @abstractmethod
    def deliver_therapy(self, patient_data): pass

    def __repr__(self): return f"{self.__class__.__name__}(id={self.device_id}, battery={self._battery_level:.1f}%)"

class InsulinPump(MedicalDevice):
    def __init__(self, device_id, insulin_reservoir=300.0, basal_rate=1.0):
        super().__init__(device_id)
        self._insulin_reservoir = insulin_reservoir
        self.basal_rate = basal_rate
        self.bolus_history = []

    @property
    def insulin_reservoir(self): return self._insulin_reservoir

    def deliver_therapy(self, patient_data):
        if self._battery_level < 10: raise LowBatteryError(f"[{self.device_id}] Battery too low!")
        if self._insulin_reservoir <= 0: raise EmptyReservoirError(f"[{self.device_id}] Reservoir empty!")
        glucose = patient_data.get("glucose", 100)
        bolus = max(0, (glucose - 100) / 50) if glucose > 140 else 0
        total = min(self.basal_rate + bolus, self._insulin_reservoir)
        self._insulin_reservoir -= total
        self._battery_level = max(0, self._battery_level - 0.5)
        self.bolus_history.append({"glucose": glucose, "bolus": round(bolus,2), "total": round(total,2)})
        print(f"  [Pump] Delivered {total:.2f}U (basal={self.basal_rate}, bolus={bolus:.2f}) | Reservoir: {self._insulin_reservoir:.1f}ml")

class GlucoseMonitor(MedicalDevice):
    def __init__(self, device_id):
        super().__init__(device_id)
        self.glucose_log = []
    def deliver_therapy(self, patient_data):
        g = patient_data.get("glucose", 0)
        self.glucose_log.append(g)
        status = "HIGH" if g > 180 else "LOW" if g < 70 else "NORMAL"
        self._battery_level = max(0, self._battery_level - 0.1)
        print(f"  [Monitor] Reading: {g} mg/dL — {status}")

if __name__ == "__main__":
    pump    = InsulinPump("PUMP-001", 300, 1.0)
    monitor = GlucoseMonitor("MON-001")
    devices = [pump, monitor]
    readings = [random.randint(80, 250) for _ in range(5)]
    print("=== 5-Cycle Therapy Simulation ===")
    for i, glucose in enumerate(readings, 1):
        print(f"\\nCycle {i} | Glucose: {glucose} mg/dL")
        for d in devices:
            try: d.deliver_therapy({"glucose": glucose})
            except (LowBatteryError, EmptyReservoirError) as e: print(f"  ERROR: {e}")
    print("\\n=== Summary Report ===")
    print(f"Reservoir remaining : {pump.insulin_reservoir:.1f} ml")
    print(f"Bolus history       : {pump.bolus_history}")
    print(pump.check_battery())
    print(monitor.check_battery())`
  },

  q2: {
    id:'q2', icon:'🏥', title:'Hospital Inventory Management System', totalMarks:25,
    concepts:['Inheritance','Polymorphism','Composition','Magic Methods','Exception Handling'],
    htmlContent:`
      <h3>Scenario</h3>
      <p>In this lab, you'll design a system to manage <strong>biomedical equipment inventory</strong> at Mulago National Referral Hospital. The hospital tracks imaging equipment (MRI scanners, CT scanners) and monitoring devices (ECG monitors, ventilators), scheduling and logging their maintenance automatically.</p>

      <h3>Objective</h3>
      <p>Fulfill the user stories below and get all the tests to pass to complete the lab.</p>

      <h3>User Stories</h3>

      <h4><span class="part-label">Part a</span> Equipment Base Class <span class="marks-badge">5 marks</span></h4>
      <p>Create a class named <code>Equipment</code> that represents a single piece of hospital equipment (e.g. an MRI scanner or an ECG monitor).</p>
      <ul>
        <li>When instantiated, accept <code>asset_id</code> (string, e.g. <code>"IMG-001"</code>), <code>name</code> (string, e.g. <code>"MRI Scanner"</code>), <code>location</code> (string, e.g. <code>"Radiology"</code>), <code>maintenance_due</code> (date string in <code>"YYYY-MM-DD"</code> format), and an optional <code>status</code> (default <code>"operational"</code>).</li>
        <li>Set <code>self.asset_id</code>, <code>self.name</code>, <code>self.location</code>, <code>self.maintenance_due</code>, and <code>self.status</code> in <code>__init__</code>.</li>
        <li>Define a <code>__str__()</code> method that returns a formatted string including the asset ID, name, location, status, and maintenance due date — for example: <code>[IMG-001] MRI Scanner | Radiology | Status: operational | Due: 2025-01-01</code>.</li>
        <li>Define <code>perform_maintenance()</code>: set <code>self.status = "operational"</code>, advance <code>self.maintenance_due</code> by one year (keep same month and day), and print a confirmation message.</li>
        <li>Define <code>is_due_for_maintenance()</code>: parse <code>self.maintenance_due</code> with <code>datetime.strptime(..., '%Y-%m-%d').date()</code> and return <code>True</code> if the date is on or before <code>date.today()</code>.</li>
      </ul>

      <h4><span class="part-label">Part b</span> ImagingDevice Subclass <span class="marks-badge">4 marks</span></h4>
      <p>Create <code>ImagingDevice(Equipment)</code> to represent imaging equipment such as MRI scanners and CT scanners.</p>
      <ul>
        <li>Accept all <code>Equipment</code> parameters plus <code>radiation_level</code> (float, mSv) and <code>calibration_date</code> (string).</li>
        <li>Override <code>perform_maintenance()</code>: call <code>super().perform_maintenance()</code>, then reset <code>self.calibration_date</code> to today's date as a string, and print the new calibration date and radiation level.</li>
        <li>Override <code>__str__()</code> to extend the base string with <code>| Radiation: X mSv | Cal: YYYY-MM-DD</code>.</li>
      </ul>

      <h4><span class="part-label">Part b cont.</span> MonitoringDevice Subclass <span class="marks-badge">3 marks</span></h4>
      <p>Create <code>MonitoringDevice(Equipment)</code> to represent bedside monitoring equipment such as ECG monitors and ventilators.</p>
      <ul>
        <li>Accept all <code>Equipment</code> parameters plus <code>battery_backup_hours</code> (int, hours of battery backup).</li>
        <li>Override <code>__str__()</code> to extend the base string with <code>| Battery backup: Xh</code>.</li>
      </ul>

      <h4><span class="part-label">Part c</span> HospitalInventory Composition <span class="marks-badge">6 marks</span></h4>
      <p>Create a class <code>HospitalInventory</code> that manages a hospital's full equipment collection using composition (it <em>contains</em> equipment objects — it does not inherit from <code>Equipment</code>).</p>
      <ul>
        <li>Accept <code>hospital_name</code> (e.g. <code>"Mulago National Referral Hospital"</code>) in <code>__init__</code>. Store equipment internally in a private dictionary <code>self._equipment</code> keyed by <code>asset_id</code>.</li>
        <li>Define <code>add_equipment(device)</code>: raise <code>DuplicateAssetError</code> if the <code>asset_id</code> already exists; otherwise store the device and print a confirmation (e.g. <code>"Added: MRI Scanner (IMG-001)"</code>).</li>
        <li>Define <code>remove_equipment(asset_id)</code>: raise <code>AssetNotFoundError</code> if the ID does not exist; otherwise remove and print a confirmation.</li>
        <li>Define <code>generate_maintenance_report()</code>: print a header with the hospital name; list all devices overdue for maintenance and call <code>perform_maintenance()</code> on each; then list all devices that are up to date.</li>
        <li>Define <code>search_by_type(device_type)</code>: return a list of all stored devices that are instances of <code>device_type</code> (e.g. <code>search_by_type(ImagingDevice)</code> returns all MRI scanners, CT scanners, etc.).</li>
      </ul>

      <h4><span class="part-label">Part d</span> Custom Exceptions &amp; Magic Methods <span class="marks-badge">4 marks</span></h4>
      <ul>
        <li>Define <code>DuplicateAssetError(Exception)</code> — raised when a device with the same <code>asset_id</code> is added twice.</li>
        <li>Define <code>AssetNotFoundError(Exception)</code> — raised when an <code>asset_id</code> that does not exist is accessed or removed.</li>
        <li>Implement <code>__len__</code> on <code>HospitalInventory</code> so that <code>len(inv)</code> returns the number of equipment items.</li>
        <li>Implement <code>__getitem__</code> on <code>HospitalInventory</code> so that <code>inv["IMG-001"]</code> returns the corresponding device or raises <code>AssetNotFoundError</code>.</li>
      </ul>

      <h4><span class="part-label">Part e</span> Demonstration <span class="marks-badge">3 marks</span></h4>
      <ul>
        <li>Create at least 4 devices — a mix of <code>ImagingDevice</code> and <code>MonitoringDevice</code> — using realistic Ugandan hospital asset IDs (e.g. <code>IMG-001</code> for the MRI Scanner in Radiology, <code>MON-001</code> for the ECG Monitor in ICU).</li>
        <li>Add all devices to a <code>HospitalInventory</code> instance, print the total device count, and call <code>generate_maintenance_report()</code>.</li>
      </ul>

      <h3>Usage Example</h3>
      <pre><code>inv = HospitalInventory("Mulago National Referral Hospital")

mri  = ImagingDevice("IMG-001", "MRI Scanner",  "Radiology", "2025-01-01", 0.5,  "2024-06-01")
ct   = ImagingDevice("IMG-002", "CT Scanner",   "Emergency", "2026-12-01", 1.2,  "2024-09-01")
ecg  = MonitoringDevice("MON-001", "ECG Monitor",  "ICU",       "2025-03-01", 8)
vent = MonitoringDevice("MON-002", "Ventilator",   "ICU",       "2026-08-01", 24)

for d in [mri, ct, ecg, vent]:
    inv.add_equipment(d)

print(f"Total devices: {len(inv)}")   # Total devices: 4
print(inv["IMG-001"])                  # prints MRI Scanner details

inv.generate_maintenance_report()     # MRI Scanner & ECG Monitor are overdue</code></pre>

      <h3>Tests</h3>
      <ol>
        <li>You should define custom exception classes <code>DuplicateAssetError</code> and <code>AssetNotFoundError</code>, both extending <code>Exception</code>.</li>
        <li>You should have an <code>Equipment</code> class whose <code>__init__</code> sets <code>asset_id</code>, <code>name</code>, <code>location</code>, <code>maintenance_due</code>, and <code>status</code>.</li>
        <li>You should have a <code>__str__()</code> method in <code>Equipment</code> that returns a formatted string with all key fields.</li>
        <li>You should have a <code>perform_maintenance()</code> method in <code>Equipment</code> that updates <code>status</code> and advances <code>maintenance_due</code> by one year.</li>
        <li>You should have an <code>is_due_for_maintenance()</code> method that compares the due date to today using <code>datetime.strptime</code> and <code>date.today()</code>.</li>
        <li>You should have an <code>ImagingDevice</code> class that inherits from <code>Equipment</code> and adds <code>radiation_level</code> and <code>calibration_date</code>.</li>
        <li><code>ImagingDevice.perform_maintenance()</code> should call <code>super().perform_maintenance()</code> and reset <code>calibration_date</code> to today.</li>
        <li><code>ImagingDevice.__str__()</code> should include radiation level and calibration date in its output.</li>
        <li>You should have a <code>MonitoringDevice</code> class that inherits from <code>Equipment</code> and adds <code>battery_backup_hours</code>.</li>
        <li><code>MonitoringDevice.__str__()</code> should include battery backup hours in its output.</li>
        <li>You should have a <code>HospitalInventory</code> class whose <code>__init__</code> accepts <code>hospital_name</code> and stores equipment in a private dictionary.</li>
        <li><code>add_equipment()</code> should store the device and raise <code>DuplicateAssetError</code> if the asset ID already exists.</li>
        <li><code>remove_equipment()</code> should remove the device and raise <code>AssetNotFoundError</code> if the asset ID does not exist.</li>
        <li><code>generate_maintenance_report()</code> should identify overdue devices, call <code>perform_maintenance()</code> on them, and list up-to-date devices separately.</li>
        <li><code>search_by_type(device_type)</code> should return a list of matching instances using <code>isinstance</code>.</li>
        <li>You should implement <code>__len__</code> on <code>HospitalInventory</code> to return the device count.</li>
        <li>You should implement <code>__getitem__</code> on <code>HospitalInventory</code> to retrieve a device by asset ID, raising <code>AssetNotFoundError</code> if not found.</li>
        <li>Your main script should create at least 4 devices (a mix of imaging and monitoring), add them to inventory, print the count, and call <code>generate_maintenance_report()</code>.</li>
      </ol>`,
    starterCode:`# Question 2: Hospital Inventory Management System
from datetime import date, datetime

# ── Part a ─────────────────────────────────────────────────────
class Equipment:
    def __init__(self, asset_id, name, location, maintenance_due, status="operational"):
        self.asset_id = asset_id
        self.name = name
        self.location = location
        self.maintenance_due = maintenance_due  # "YYYY-MM-DD"
        self.status = status

    def __str__(self): pass

    def perform_maintenance(self): pass

    def is_due_for_maintenance(self): pass  # compare to date.today()


# ── Part b ─────────────────────────────────────────────────────
class ImagingDevice(Equipment):
    def __init__(self, asset_id, name, location, maintenance_due,
                 radiation_level, calibration_date):
        super().__init__(asset_id, name, location, maintenance_due)
        self.radiation_level = radiation_level
        self.calibration_date = calibration_date

    def perform_maintenance(self): pass  # call super + reset calibration_date


class MonitoringDevice(Equipment):
    def __init__(self, asset_id, name, location, maintenance_due, battery_backup_hours):
        super().__init__(asset_id, name, location, maintenance_due)
        self.battery_backup_hours = battery_backup_hours


# ── Part c ─────────────────────────────────────────────────────
class HospitalInventory:
    def __init__(self, hospital_name):
        self.hospital_name = hospital_name
        self._equipment = {}  # asset_id -> Equipment

    def add_equipment(self, device): pass
    def remove_equipment(self, asset_id): pass
    def generate_maintenance_report(self): pass
    def search_by_type(self, device_type): pass

    # Part d
    def __len__(self): pass
    def __getitem__(self, asset_id): pass


# ── Part e ─────────────────────────────────────────────────────
if __name__ == "__main__":
    inv = HospitalInventory("Mulago National Referral Hospital")

    mri  = ImagingDevice("IMG-001","MRI Scanner","Radiology","2025-01-01",0.5,"2024-06-01")
    ct   = ImagingDevice("IMG-002","CT Scanner","Emergency","2026-12-01",1.2,"2024-09-01")
    ecg  = MonitoringDevice("MON-001","ECG Monitor","ICU","2025-03-01",8)
    vent = MonitoringDevice("MON-002","Ventilator","ICU","2026-08-01",24)

    for d in [mri, ct, ecg, vent]:
        inv.add_equipment(d)

    print(f"Total devices: {len(inv)}")
    inv.generate_maintenance_report()
`,
    hints:[
      "💡 is_due_for_maintenance: parse the date string with datetime.strptime(self.maintenance_due,'%Y-%m-%d').date() then return due_date <= date.today().",
      "💡 In add_equipment, check 'if device.asset_id in self._equipment' and raise a custom DuplicateAssetError if true, otherwise store it.",
      "💡 search_by_type(device_type) uses isinstance: return [d for d in self._equipment.values() if isinstance(d, device_type)]. Call it like search_by_type(ImagingDevice)."
    ],
    solution:`from datetime import date, datetime

class DuplicateAssetError(Exception): pass
class AssetNotFoundError(Exception): pass

class Equipment:
    def __init__(self, asset_id, name, location, maintenance_due, status="operational"):
        self.asset_id=asset_id; self.name=name; self.location=location
        self.maintenance_due=maintenance_due; self.status=status

    def __str__(self):
        return f"[{self.asset_id}] {self.name} | {self.location} | Status: {self.status} | Due: {self.maintenance_due}"

    def perform_maintenance(self):
        self.status = "operational"
        today = date.today()
        self.maintenance_due = str(date(today.year+1, today.month, today.day))
        print(f"  Maintenance done on {self.name}. Next due: {self.maintenance_due}")

    def is_due_for_maintenance(self):
        return datetime.strptime(self.maintenance_due,'%Y-%m-%d').date() <= date.today()

class ImagingDevice(Equipment):
    def __init__(self, asset_id, name, location, maintenance_due, radiation_level, calibration_date):
        super().__init__(asset_id, name, location, maintenance_due)
        self.radiation_level=radiation_level; self.calibration_date=calibration_date
    def perform_maintenance(self):
        super().perform_maintenance()
        self.calibration_date = str(date.today())
        print(f"  Calibration reset. Radiation level: {self.radiation_level}mSv")
    def __str__(self): return super().__str__()+f" | Radiation:{self.radiation_level}mSv | Cal:{self.calibration_date}"

class MonitoringDevice(Equipment):
    def __init__(self, asset_id, name, location, maintenance_due, battery_backup_hours):
        super().__init__(asset_id, name, location, maintenance_due)
        self.battery_backup_hours=battery_backup_hours
    def __str__(self): return super().__str__()+f" | Battery backup:{self.battery_backup_hours}h"

class HospitalInventory:
    def __init__(self, hospital_name):
        self.hospital_name=hospital_name; self._equipment={}
    def add_equipment(self, device):
        if device.asset_id in self._equipment: raise DuplicateAssetError(f"Asset '{device.asset_id}' already exists")
        self._equipment[device.asset_id]=device; print(f"Added: {device.name} ({device.asset_id})")
    def remove_equipment(self, asset_id):
        if asset_id not in self._equipment: raise AssetNotFoundError(asset_id)
        print(f"Removed: {self._equipment.pop(asset_id).name}")
    def generate_maintenance_report(self):
        print(f"\\n{'='*55}\\nMAINTENANCE REPORT — {self.hospital_name}\\n{'='*55}")
        due=[d for d in self._equipment.values() if d.is_due_for_maintenance()]
        ok =[d for d in self._equipment.values() if not d.is_due_for_maintenance()]
        print(f"\\n⚠  OVERDUE ({len(due)}):")
        for d in due: print(f"  {d}"); d.perform_maintenance()
        print(f"\\n✓  UP TO DATE ({len(ok)}):")
        for d in ok: print(f"  {d}")
        print(f"{'='*55}")
    def search_by_type(self, device_type): return [d for d in self._equipment.values() if isinstance(d,device_type)]
    def __len__(self): return len(self._equipment)
    def __getitem__(self, asset_id):
        if asset_id not in self._equipment: raise AssetNotFoundError(asset_id)
        return self._equipment[asset_id]

if __name__ == "__main__":
    inv=HospitalInventory("Mulago National Referral Hospital")
    mri =ImagingDevice("IMG-001","MRI Scanner","Radiology","2025-01-01",0.5,"2024-06-01")
    ct  =ImagingDevice("IMG-002","CT Scanner","Emergency","2026-12-01",1.2,"2024-09-01")
    ecg =MonitoringDevice("MON-001","ECG Monitor","ICU","2025-03-01",8)
    vent=MonitoringDevice("MON-002","Ventilator","ICU","2026-08-01",24)
    for d in [mri,ct,ecg,vent]: inv.add_equipment(d)
    print(f"Total devices: {len(inv)}")
    imaging=inv.search_by_type(ImagingDevice)
    print(f"Imaging devices: {len(imaging)}")
    inv.generate_maintenance_report()`
  },

  q3: {
    id:'q3', icon:'💊', title:'Patient Record & Drug Delivery Management', totalMarks:30,
    concepts:['Composition','Inheritance','Polymorphism','Encapsulation','Exception Handling'],
    htmlContent:`
      <h3>Scenario</h3>
      <p>In this lab, you'll build a system for managing <strong>patient records</strong> linked with personalised <strong>drug delivery schedules</strong>. The system tracks patients like Alice Nakamura (Type 2 Diabetes) and Bob Ochieng (Hypertension), manages their medications — including IV drips (Insulin Drip) and oral tablets (Metformin, Lisinopril) — and safely handles allergy conflicts such as a patient allergic to Penicillin.</p>

      <h3>Objective</h3>
      <p>Fulfill the user stories below and get all the tests to pass to complete the lab.</p>

      <h3>User Stories</h3>

      <h4><span class="part-label">Part a</span> Patient Class <span class="marks-badge">6 marks</span></h4>
      <p>Create a class named <code>Patient</code> that stores a patient's identity, medical history, conditions, and allergies.</p>
      <ul>
        <li>When instantiated, accept <code>patient_id</code> (string, e.g. <code>"P001"</code>), <code>name</code> (string, e.g. <code>"Alice Nakamura"</code>), and <code>age</code> (int).</li>
        <li>Set <code>self.patient_id</code>, <code>self.name</code>, and <code>self.age</code>.</li>
        <li>Set <code>self.medical_history</code> to an empty list — this will hold timestamped log entries.</li>
        <li>Set <code>self.current_conditions</code> to an empty dictionary — keys are condition names (e.g. <code>"Type 2 Diabetes"</code>), values are severity strings (e.g. <code>"moderate"</code>).</li>
        <li>Set <code>self._allergies</code> to an empty list (private) — holds drug names the patient is allergic to (e.g. <code>"Penicillin"</code>).</li>
        <li>Define <code>add_condition(condition, severity="moderate")</code>: store the condition in <code>current_conditions</code> and call <code>update_history()</code> with a descriptive log entry like <code>"Diagnosed: Type 2 Diabetes (moderate)"</code>.</li>
        <li>Define <code>update_history(entry)</code>: append a timestamped entry (using <code>datetime.now().strftime('%Y-%m-%d')</code>) to <code>medical_history</code>.</li>
        <li>Define <code>add_allergy(drug_name)</code>: append the drug name to <code>self._allergies</code> and call <code>update_history()</code> to log the allergy.</li>
        <li>Define <code>__repr__()</code>: return a string such as <code>Patient(P001, Alice Nakamura, age=45, conditions=[Type 2 Diabetes])</code>.</li>
      </ul>

      <h4><span class="part-label">Part b</span> Medication Base Class <span class="marks-badge">5 marks</span></h4>
      <p>Create a class named <code>Medication</code> that represents a generic drug.</p>
      <ul>
        <li>When instantiated, accept <code>drug_name</code> (string, e.g. <code>"Metformin"</code>), <code>dosage</code> (string, e.g. <code>"500mg"</code>), <code>frequency</code> (string, e.g. <code>"twice daily"</code>), and an optional <code>side_effects</code> list (default empty list).</li>
        <li>Define <code>administer(patient)</code>: check if <code>self.drug_name</code> is in <code>patient._allergies</code> and raise <code>AllergyError</code> if so. Otherwise call <code>patient.update_history()</code> to log the administration and print a confirmation like <code>"✓ Metformin 500mg → Alice Nakamura"</code>.</li>
        <li>Define <code>__str__()</code> that returns <code>"drug_name dosage (frequency)"</code>, e.g. <code>"Metformin 500mg (twice daily)"</code>.</li>
      </ul>

      <h4><span class="part-label">Part c</span> Medication Subclasses <span class="marks-badge">7 marks</span></h4>
      <p>Create two subclasses of <code>Medication</code> with polymorphic <code>administer()</code> behaviour.</p>
      <ul>
        <li>Create <code>InfusionMedication(Medication)</code> for IV drugs like <em>Insulin Drip</em>. Accept an additional parameter <code>infusion_rate</code> (float, ml/hr, e.g. 50 ml/hr). Override <code>administer(patient)</code>: check allergy, compute estimated duration as <code>60 / infusion_rate</code> hours, log to patient history, and print a line like <code>"💉 IV Insulin Drip @ 50ml/hr (~1.2h) → Alice Nakamura"</code>.</li>
        <li>Create <code>OralMedication(Medication)</code> for tablet drugs like <em>Metformin</em>, <em>Lisinopril</em>, and <em>Penicillin</em>. Accept an additional parameter <code>pill_count</code> (int, e.g. 60). Override <code>administer(patient)</code>: check allergy, raise <code>ValueError</code> if <code>pill_count</code> is 0, decrement <code>pill_count</code> by 1, log to patient history, and print a line like <code>"💊 Metformin 500mg → Alice Nakamura (59 pills left)"</code>.</li>
      </ul>

      <h4><span class="part-label">Part d</span> TreatmentPlan Composition <span class="marks-badge">6 marks</span></h4>
      <p>Create a class <code>TreatmentPlan</code> that composes a <code>Patient</code> with a schedule of <code>Medication</code> objects.</p>
      <ul>
        <li>Accept <code>patient</code> in <code>__init__</code>. Store it as <code>self.patient</code> and initialise <code>self.schedule = []</code>.</li>
        <li>Define <code>schedule_dose(medication, time)</code>: append <code>{"time": time, "medication": medication}</code> to <code>self.schedule</code>.</li>
        <li>Define <code>check_interactions()</code>: scan all scheduled medications' <code>side_effects</code> for duplicates across drugs (e.g. two drugs both causing <code>"hypoglycemia"</code>) and warn about polypharmacy if more than 3 medications are scheduled. Return a list of warning strings.</li>
        <li>Define <code>generate_daily_schedule()</code>: print the patient's name and their schedule sorted by time. For each entry, call <code>medication.administer(self.patient)</code> inside a <code>try/except</code> block — if <code>AllergyError</code> is raised, print a skip message; if <code>ValueError</code> is raised, print an error message.</li>
      </ul>

      <h4><span class="part-label">Part e</span> 3-Day Simulation <span class="marks-badge">6 marks</span></h4>
      <ul>
        <li>Create patient <strong>Alice Nakamura</strong> (P001, age 45) with condition <code>"Type 2 Diabetes"</code> (moderate) and allergy <code>"Penicillin"</code>.</li>
        <li>Create patient <strong>Bob Ochieng</strong> (P002, age 62) with condition <code>"Hypertension"</code> (high).</li>
        <li>Create medications: <code>Metformin</code> (oral, 500mg, twice daily, 60 pills), <code>Insulin Drip</code> (IV, 10u/hr, continuous, 50 ml/hr), <code>Lisinopril</code> (oral, 10mg, once daily, 30 pills), and <code>Penicillin</code> (oral, 250mg, 3x daily, 90 pills).</li>
        <li>Schedule all four medications for Alice (Penicillin will trigger <code>AllergyError</code>). Schedule Lisinopril for Bob.</li>
        <li>Loop through 3 days, calling <code>generate_daily_schedule()</code> for each patient on each day.</li>
      </ul>

      <h3>Usage Example</h3>
      <pre><code>alice = Patient("P001", "Alice Nakamura", 45)
alice.add_condition("Type 2 Diabetes", "moderate")
alice.add_allergy("Penicillin")

metformin  = OralMedication("Metformin", "500mg", "twice daily", 60)
insulin_iv = InfusionMedication("Insulin Drip", "10u/hr", "continuous", 50, ["hypoglycemia"])
penicillin = OralMedication("Penicillin", "250mg", "3x daily", 90)

plan = TreatmentPlan(alice)
plan.schedule_dose(metformin,  "08:00")
plan.schedule_dose(insulin_iv, "08:00")
plan.schedule_dose(penicillin, "12:00")  # ← will be SKIPPED (AllergyError)

plan.generate_daily_schedule()
# 08:00 → ✓ Metformin 500mg → Alice Nakamura (59 pills left)
# 08:00 → 💉 IV Insulin Drip @ 50ml/hr → Alice Nakamura
# 12:00 → SKIPPED — ALLERGY: Alice Nakamura allergic to Penicillin!</code></pre>

      <h3>Tests</h3>
      <ol>
        <li>You should define a custom exception class <code>AllergyError</code> that extends <code>Exception</code>.</li>
        <li>You should have a <code>Patient</code> class whose <code>__init__</code> sets <code>patient_id</code>, <code>name</code>, <code>age</code>, <code>medical_history</code>, <code>current_conditions</code>, and <code>_allergies</code>.</li>
        <li>You should have an <code>add_condition(condition, severity)</code> method that stores the condition in <code>current_conditions</code> and calls <code>update_history()</code>.</li>
        <li>You should have an <code>update_history(entry)</code> method that appends a timestamped string to <code>medical_history</code>.</li>
        <li>You should have an <code>add_allergy(drug_name)</code> method that appends the drug to <code>self._allergies</code> and calls <code>update_history()</code>.</li>
        <li>You should have a <code>__repr__()</code> method on <code>Patient</code> that includes patient ID, name, age, and conditions.</li>
        <li>You should have a <code>Medication</code> class whose <code>__init__</code> sets <code>drug_name</code>, <code>dosage</code>, <code>frequency</code>, and <code>side_effects</code>.</li>
        <li>You should have an <code>administer(patient)</code> method in <code>Medication</code> that raises <code>AllergyError</code> if the drug name is in <code>patient._allergies</code>.</li>
        <li>You should have a <code>__str__()</code> method on <code>Medication</code> returning <code>"drug_name dosage (frequency)"</code>.</li>
        <li>You should have an <code>InfusionMedication</code> class that inherits from <code>Medication</code> and adds <code>infusion_rate</code>.</li>
        <li><code>InfusionMedication.administer()</code> should check allergy, print infusion details including rate and estimated duration, and log to patient history.</li>
        <li>You should have an <code>OralMedication</code> class that inherits from <code>Medication</code> and adds <code>pill_count</code>.</li>
        <li><code>OralMedication.administer()</code> should check allergy, decrement <code>pill_count</code>, print pills remaining, and raise <code>ValueError</code> when empty.</li>
        <li>You should have a <code>TreatmentPlan</code> class whose <code>__init__</code> stores <code>patient</code> and an empty <code>schedule</code> list.</li>
        <li>You should have a <code>schedule_dose(medication, time)</code> method that appends a timed entry to <code>self.schedule</code>.</li>
        <li>You should have a <code>check_interactions()</code> method that detects overlapping side effects across medications and warns about polypharmacy (&gt;3 meds).</li>
        <li>You should have a <code>generate_daily_schedule()</code> method that sorts doses by time and calls <code>administer()</code> in a <code>try/except</code> block, handling <code>AllergyError</code> and <code>ValueError</code>.</li>
        <li>Your main script should create Alice with a Penicillin allergy and Bob with Hypertension, run a 3-day loop calling <code>generate_daily_schedule()</code> for each patient.</li>
      </ol>`,
    starterCode:`# Question 3: Patient Record & Drug Delivery Management
from datetime import datetime

class AllergyError(Exception): pass

# ── Part a ─────────────────────────────────────────────────────
class Patient:
    def __init__(self, patient_id, name, age):
        self.patient_id = patient_id
        self.name = name
        self.age = age
        self.medical_history = []
        self.current_conditions = {}
        self._allergies = []

    def add_condition(self, condition, severity="moderate"): pass
    def update_history(self, entry): pass
    def add_allergy(self, drug_name): pass
    def __repr__(self): pass


# ── Part b ─────────────────────────────────────────────────────
class Medication:
    def __init__(self, drug_name, dosage, frequency, side_effects=None):
        self.drug_name = drug_name
        self.dosage = dosage
        self.frequency = frequency
        self.side_effects = side_effects or []

    def administer(self, patient):
        # Check allergy first, then log
        pass

    def __str__(self): return f"{self.drug_name} {self.dosage} ({self.frequency})"


# ── Part c ─────────────────────────────────────────────────────
class InfusionMedication(Medication):
    def __init__(self, drug_name, dosage, frequency, infusion_rate, side_effects=None):
        super().__init__(drug_name, dosage, frequency, side_effects)
        self.infusion_rate = infusion_rate  # ml/hr
    def administer(self, patient): pass


class OralMedication(Medication):
    def __init__(self, drug_name, dosage, frequency, pill_count, side_effects=None):
        super().__init__(drug_name, dosage, frequency, side_effects)
        self.pill_count = pill_count
    def administer(self, patient): pass


# ── Part d ─────────────────────────────────────────────────────
class TreatmentPlan:
    def __init__(self, patient):
        self.patient = patient
        self.schedule = []

    def schedule_dose(self, medication, time): pass
    def check_interactions(self): pass
    def generate_daily_schedule(self): pass


# ── Part e ─────────────────────────────────────────────────────
if __name__ == "__main__":
    alice = Patient("P001","Alice Nakamura",45)
    bob   = Patient("P002","Bob Ochieng",62)
    alice.add_condition("Type 2 Diabetes","moderate")
    alice.add_allergy("Penicillin")
    bob.add_condition("Hypertension","high")

    metformin  = OralMedication("Metformin","500mg","twice daily",60)
    insulin_iv = InfusionMedication("Insulin Drip","10 units/hr","continuous",50,["hypoglycemia"])
    lisinopril = OralMedication("Lisinopril","10mg","once daily",30)
    penicillin = OralMedication("Penicillin","250mg","3x daily",90)

    plan_alice = TreatmentPlan(alice)
    plan_alice.schedule_dose(metformin,  "08:00")
    plan_alice.schedule_dose(insulin_iv, "08:00")
    plan_alice.schedule_dose(penicillin, "12:00")  # will trigger AllergyError!

    plan_bob = TreatmentPlan(bob)
    plan_bob.schedule_dose(lisinopril, "09:00")

    print("=== 3-Day Medication Simulation ===")
    for day in range(1, 4):
        print(f"\\n--- Day {day} ---")
        for plan in [plan_alice, plan_bob]:
            plan.generate_daily_schedule()
`,
    hints:[
      "💡 Store allergies as self._allergies (private list). In Medication.administer(), do: if self.drug_name in patient._allergies: raise AllergyError(...). Then log to patient.medical_history.",
      "💡 TreatmentPlan.schedule_dose appends {'time':time,'medication':medication} to self.schedule. generate_daily_schedule sorts by time and calls medication.administer(self.patient) inside try/except AllergyError.",
      "💡 check_interactions: collect all side_effects from all scheduled meds. If any effect appears in 2+ meds, print a warning. Also warn if more than 3 meds are scheduled (polypharmacy)."
    ],
    solution:`from datetime import datetime

class AllergyError(Exception): pass

class Patient:
    def __init__(self, patient_id, name, age):
        self.patient_id=patient_id; self.name=name; self.age=age
        self.medical_history=[]; self.current_conditions={}; self._allergies=[]
    def add_condition(self, condition, severity="moderate"):
        self.current_conditions[condition]=severity
        self.update_history(f"Diagnosed: {condition} ({severity})")
    def update_history(self, entry):
        self.medical_history.append(f"[{datetime.now().strftime('%Y-%m-%d')}] {entry}")
    def add_allergy(self, drug_name):
        self._allergies.append(drug_name); self.update_history(f"Allergy: {drug_name}")
    def __repr__(self):
        c=', '.join(self.current_conditions) or 'None'
        return f"Patient({self.patient_id}, {self.name}, age={self.age}, conditions=[{c}])"

class Medication:
    def __init__(self, drug_name, dosage, frequency, side_effects=None):
        self.drug_name=drug_name; self.dosage=dosage
        self.frequency=frequency; self.side_effects=side_effects or []
    def administer(self, patient):
        if self.drug_name in patient._allergies: raise AllergyError(f"ALLERGY: {patient.name} allergic to {self.drug_name}!")
        patient.update_history(f"Administered: {self}")
        print(f"    ✓ {self.drug_name} {self.dosage} → {patient.name}")
    def __str__(self): return f"{self.drug_name} {self.dosage} ({self.frequency})"

class InfusionMedication(Medication):
    def __init__(self, drug_name, dosage, frequency, infusion_rate, side_effects=None):
        super().__init__(drug_name, dosage, frequency, side_effects)
        self.infusion_rate=infusion_rate
    def administer(self, patient):
        if self.drug_name in patient._allergies: raise AllergyError(f"ALLERGY: {patient.name} allergic to {self.drug_name}!")
        dur = 60/self.infusion_rate if self.infusion_rate>0 else 0
        patient.update_history(f"IV: {self}")
        print(f"    💉 IV {self.drug_name} @ {self.infusion_rate}ml/hr (~{dur:.1f}h) → {patient.name}")

class OralMedication(Medication):
    def __init__(self, drug_name, dosage, frequency, pill_count, side_effects=None):
        super().__init__(drug_name, dosage, frequency, side_effects)
        self.pill_count=pill_count
    def administer(self, patient):
        if self.drug_name in patient._allergies: raise AllergyError(f"ALLERGY: {patient.name} allergic to {self.drug_name}!")
        if self.pill_count<=0: raise ValueError(f"{self.drug_name}: No pills remaining!")
        self.pill_count-=1; patient.update_history(f"Oral: {self}")
        print(f"    💊 {self.drug_name} {self.dosage} → {patient.name} ({self.pill_count} pills left)")

class TreatmentPlan:
    def __init__(self, patient): self.patient=patient; self.schedule=[]
    def schedule_dose(self, medication, time):
        self.schedule.append({'time':time,'medication':medication})
    def check_interactions(self):
        seen=[]; warnings=[]
        for e in self.schedule:
            for eff in e['medication'].side_effects:
                if eff in seen: warnings.append(f"Interaction risk: '{eff}' in multiple meds!")
                seen.append(eff)
        if len(self.schedule)>3: warnings.append("Polypharmacy warning: >3 medications scheduled.")
        return warnings
    def generate_daily_schedule(self):
        print(f"  [{self.patient.name}] Daily Schedule:")
        for w in self.check_interactions(): print(f"    ⚠ {w}")
        for e in sorted(self.schedule,key=lambda x:x['time']):
            print(f"    {e['time']} → ",end="")
            try: e['medication'].administer(self.patient)
            except AllergyError as ex: print(f"SKIPPED — {ex}")
            except ValueError as ex:   print(f"ERROR — {ex}")

if __name__ == "__main__":
    alice=Patient("P001","Alice Nakamura",45); bob=Patient("P002","Bob Ochieng",62)
    alice.add_condition("Type 2 Diabetes","moderate"); alice.add_allergy("Penicillin")
    bob.add_condition("Hypertension","high")
    metformin =OralMedication("Metformin","500mg","twice daily",60)
    insulin_iv=InfusionMedication("Insulin Drip","10u/hr","continuous",50,["hypoglycemia"])
    lisinopril=OralMedication("Lisinopril","10mg","once daily",30)
    penicillin=OralMedication("Penicillin","250mg","3x daily",90)
    plan_alice=TreatmentPlan(alice)
    plan_alice.schedule_dose(metformin,"08:00"); plan_alice.schedule_dose(insulin_iv,"08:00"); plan_alice.schedule_dose(penicillin,"12:00")
    plan_bob=TreatmentPlan(bob); plan_bob.schedule_dose(lisinopril,"09:00")
    print("=== 3-Day Medication Simulation ===")
    for day in range(1,4):
        print(f"\\n--- Day {day} ---")
        for plan in [plan_alice,plan_bob]: plan.generate_daily_schedule()
    print("\\n=== Patient Records ===")
    for p in [alice,bob]:
        print(f"\\n{repr(p)}")
        for h in p.medical_history[-3:]: print(f"  {h}")`
  },

  q4: {
    id:'q4', icon:'📡', title:'Biomedical Signal Processing Device Simulator', totalMarks:20,
    concepts:['Abstract Classes','Polymorphism','Composition','Magic Methods','Error Handling'],
    htmlContent:`
      <h3>Scenario</h3>
      <p>In this lab, you'll simulate OOP design for clinical devices that process <strong>physiological signals</strong>. You'll build an ECG processor (for heart rhythm analysis on a patient like Grace Atieno) and an EEG processor (for brain state classification), then integrate them into a unified patient monitor.</p>

      <h3>Objective</h3>
      <p>Fulfill the user stories below and get all the tests to pass to complete the lab.</p>

      <h3>User Stories</h3>

      <h4><span class="part-label">Part a</span> Abstract Base Class — BioSignalProcessor <span class="marks-badge">5 marks</span></h4>
      <p>Create an abstract base class named <code>BioSignalProcessor</code> using the <code>abc</code> module.</p>
      <ul>
        <li>Import <code>ABC</code> and <code>abstractmethod</code> from <code>abc</code>.</li>
        <li>When instantiated, accept <code>signal_type</code> (string, e.g. <code>"ECG"</code> or <code>"EEG"</code>) and <code>sampling_rate</code> (Hz, e.g. 500 for ECG or 256 for EEG).</li>
        <li>Set <code>self.signal_type</code>, <code>self.sampling_rate</code>, <code>self.raw_data = []</code>, and <code>self.results = {}</code>.</li>
        <li>Define <code>load_data(data)</code>: raise <code>TypeError</code> if <code>data</code> is not a list, otherwise set <code>self.raw_data = data</code>.</li>
        <li>Define <code>process_signal()</code> decorated with <code>@abstractmethod</code>.</li>
        <li>Define <code>__repr__()</code> that returns something like <code>ECGProcessor(type=ECG, rate=500Hz, samples=500)</code>.</li>
      </ul>

      <h4><span class="part-label">Part b</span> ECGProcessor Subclass <span class="marks-badge">3 marks</span></h4>
      <p>Create <code>ECGProcessor(BioSignalProcessor)</code> for analysing electrocardiogram data from heart monitors.</p>
      <ul>
        <li>Call <code>super().__init__("ECG", sampling_rate)</code> with a default <code>sampling_rate=500</code>. Set <code>self.threshold = 0.5</code> (mV — samples above this level are counted as QRS heartbeat peaks).</li>
        <li>Implement <code>process_signal()</code>: raise <code>ValueError</code> if <code>raw_data</code> is empty. Count all samples above <code>self.threshold</code> as peaks. Compute <code>duration_s = len(raw_data) / sampling_rate</code> and <code>heart_rate = (peak_count / duration_s) * 60</code> (bpm). Store in <code>self.results</code> as <code>{"qrs_count": N, "heart_rate": bpm, "duration_s": s}</code>.</li>
        <li>Define <code>detect_arrhythmia()</code>: read <code>self.results["heart_rate"]</code> and return <code>"Bradycardia (HR=X bpm)"</code> if HR &lt; 60, <code>"Tachycardia (HR=X bpm)"</code> if HR &gt; 100, or <code>"Normal sinus rhythm (HR=X bpm)"</code> otherwise.</li>
      </ul>

      <h4><span class="part-label">Part b cont.</span> EEGProcessor Subclass <span class="marks-badge">3 marks</span></h4>
      <p>Create <code>EEGProcessor(BioSignalProcessor)</code> for analysing electroencephalogram data from brain activity monitors.</p>
      <ul>
        <li>Call <code>super().__init__("EEG", sampling_rate)</code> with a default <code>sampling_rate=256</code>.</li>
        <li>Implement <code>process_signal()</code>: raise <code>ValueError</code> if <code>raw_data</code> is empty. Split <code>raw_data</code> into 4 equal chunks representing brain wave bands (delta, theta, alpha, beta). Compute the average absolute amplitude of each chunk. Normalise so the four values sum to 100%. Store as <code>self.results = {"delta": %, "theta": %, "alpha": %, "beta": %}</code>.</li>
        <li>Define <code>classify_state()</code>: find the dominant band (highest %) and return its label — <code>"delta"→"Deep Sleep"</code>, <code>"theta"→"Drowsy"</code>, <code>"alpha"→"Relaxed"</code>, <code>"beta"→"Alert"</code>.</li>
        <li>Implement <code>__add__(self, other)</code>: create a new <code>EEGProcessor</code> loaded with <code>self.raw_data + other.raw_data</code>. Raise <code>TypeError</code> if <code>other</code> is not an <code>EEGProcessor</code>.</li>
      </ul>

      <h4><span class="part-label">Part c</span> PatientMonitor Composition <span class="marks-badge">5 marks</span></h4>
      <p>Create a class <code>PatientMonitor</code> that composes multiple signal processors for one patient (e.g. <em>Grace Atieno</em>).</p>
      <ul>
        <li>Accept <code>patient_name</code> in <code>__init__</code>. Initialise <code>self.processors = []</code>.</li>
        <li>Define <code>add_processor(processor)</code>: raise <code>TypeError</code> if not a <code>BioSignalProcessor</code>; otherwise append to <code>self.processors</code>.</li>
        <li>Define <code>acquire_data(processor, data)</code>: call <code>processor.load_data(data)</code> and print a confirmation like <code>"Acquired ECG: 500 samples"</code>.</li>
        <li>Define <code>analyze_all()</code>: call <code>process_signal()</code> on each processor inside a <code>try/except</code> block, printing a success tick or failure message for each.</li>
        <li>Define <code>generate_report()</code>: print a formatted report for each processor listing its results and a clinical interpretation — arrhythmia status for <code>ECGProcessor</code>, and brain state for <code>EEGProcessor</code>.</li>
      </ul>

      <h4><span class="part-label">Part d</span> Polymorphism &amp; Magic Methods <span class="marks-badge">4 marks</span></h4>
      <ul>
        <li>Demonstrate polymorphism: add both an <code>ECGProcessor</code> and an <code>EEGProcessor</code> to a single <code>PatientMonitor</code> and call <code>analyze_all()</code> and <code>generate_report()</code> through the same interface.</li>
        <li>Test <code>EEGProcessor.__add__</code> by combining two separate <code>EEGProcessor</code> instances, calling <code>process_signal()</code> on the combined result, and printing its sample count and brain state.</li>
        <li>Ensure <code>load_data()</code> raises <code>TypeError</code> for non-list input, and that <code>process_signal()</code> raises <code>ValueError</code> for empty data — both caught with <code>try/except</code>.</li>
      </ul>

      <h3>Usage Example</h3>
      <pre><code>monitor = PatientMonitor("Grace Atieno")
ecg = ECGProcessor(500)
eeg = EEGProcessor(256)

monitor.add_processor(ecg)
monitor.add_processor(eeg)

monitor.acquire_data(ecg, [random.uniform(0, 1)     for _ in range(500)])
monitor.acquire_data(eeg, [random.uniform(-0.1, 0.1) for _ in range(256)])

monitor.analyze_all()
monitor.generate_report()

# ECG output:  Interpretation: Normal sinus rhythm (HR=72.0 bpm)
# EEG output:  Brain state: Relaxed

eeg2 = EEGProcessor(256)
eeg2.load_data([random.uniform(-0.1, 0.1) for _ in range(256)])
combined = eeg + eeg2
combined.process_signal()
print(f"Combined samples: {len(combined.raw_data)}, State: {combined.classify_state()}")</code></pre>

      <h3>Tests</h3>
      <ol>
        <li>You should import <code>ABC</code> and <code>abstractmethod</code> from the <code>abc</code> module.</li>
        <li>You should have a <code>BioSignalProcessor</code> abstract class whose <code>__init__</code> sets <code>signal_type</code>, <code>sampling_rate</code>, <code>raw_data = []</code>, and <code>results = {}</code>.</li>
        <li>You should have a <code>load_data(data)</code> method that raises <code>TypeError</code> for non-list input and sets <code>self.raw_data</code>.</li>
        <li>You should have <code>process_signal</code> decorated with <code>@abstractmethod</code> in <code>BioSignalProcessor</code>.</li>
        <li>You should have a <code>__repr__()</code> method on <code>BioSignalProcessor</code> that includes class name, signal type, sampling rate, and sample count.</li>
        <li>You should have an <code>ECGProcessor</code> class that inherits from <code>BioSignalProcessor</code> with <code>signal_type="ECG"</code> and <code>self.threshold = 0.5</code>.</li>
        <li><code>ECGProcessor.process_signal()</code> should count QRS peaks above the threshold, compute heart rate in bpm, and store results in <code>self.results</code>.</li>
        <li>You should have a <code>detect_arrhythmia()</code> method on <code>ECGProcessor</code> that returns a bradycardia, tachycardia, or normal rhythm interpretation string.</li>
        <li>You should have an <code>EEGProcessor</code> class that inherits from <code>BioSignalProcessor</code> with <code>signal_type="EEG"</code>.</li>
        <li><code>EEGProcessor.process_signal()</code> should split data into 4 chunks and compute normalised band power percentages for delta, theta, alpha, and beta.</li>
        <li>You should have a <code>classify_state()</code> method on <code>EEGProcessor</code> that returns the brain state label of the dominant band.</li>
        <li>You should implement <code>__add__</code> on <code>EEGProcessor</code> to combine two processors' raw data into a new <code>EEGProcessor</code>, raising <code>TypeError</code> for incompatible types.</li>
        <li>You should have a <code>PatientMonitor</code> class whose <code>__init__</code> sets <code>patient_name</code> and <code>processors = []</code>.</li>
        <li><code>add_processor()</code> should raise <code>TypeError</code> if the argument is not a <code>BioSignalProcessor</code> instance.</li>
        <li>You should have an <code>analyze_all()</code> method that calls <code>process_signal()</code> on each processor with <code>try/except</code> error handling.</li>
        <li>You should have a <code>generate_report()</code> method that prints all results and clinical interpretations for each processor.</li>
        <li>Your main script should demonstrate polymorphism by running <code>analyze_all()</code> and <code>generate_report()</code> on a monitor with both processor types.</li>
        <li>Your main script should test the <code>EEGProcessor.__add__</code> magic method and print the combined sample count and brain state.</li>
      </ol>`,
    starterCode:`# Question 4: Biomedical Signal Processing Device Simulator
from abc import ABC, abstractmethod
import random

# ── Part a ─────────────────────────────────────────────────────
class BioSignalProcessor(ABC):
    def __init__(self, signal_type, sampling_rate):
        self.signal_type = signal_type
        self.sampling_rate = sampling_rate  # Hz
        self.raw_data = []
        self.results = {}

    def load_data(self, data):
        self.raw_data = data

    @abstractmethod
    def process_signal(self):
        pass

    def __repr__(self):
        return f"{self.__class__.__name__}(type={self.signal_type}, rate={self.sampling_rate}Hz, samples={len(self.raw_data)})"


# ── Part b ─────────────────────────────────────────────────────
class ECGProcessor(BioSignalProcessor):
    def __init__(self, sampling_rate=500):
        super().__init__("ECG", sampling_rate)
        self.threshold = 0.5  # mV — values above this are QRS peaks

    def process_signal(self):
        pass  # count peaks, compute bpm, store in self.results

    def detect_arrhythmia(self):
        pass  # bradycardia <60, tachycardia >100


class EEGProcessor(BioSignalProcessor):
    def __init__(self, sampling_rate=256):
        super().__init__("EEG", sampling_rate)

    def process_signal(self):
        pass  # split into 4 chunks → delta/theta/alpha/beta band power %

    def classify_state(self):
        pass  # dominant band → brain state label

    def __add__(self, other):
        pass  # combine raw_data from two EEGProcessors


# ── Part c ─────────────────────────────────────────────────────
class PatientMonitor:
    def __init__(self, patient_name):
        self.patient_name = patient_name
        self.processors = []

    def add_processor(self, processor): pass
    def acquire_data(self, processor, data): pass
    def analyze_all(self): pass
    def generate_report(self): pass


# ── Part d Demo ────────────────────────────────────────────────
if __name__ == "__main__":
    monitor = PatientMonitor("Grace Atieno")
    ecg = ECGProcessor(500)
    eeg = EEGProcessor(256)
    monitor.add_processor(ecg)
    monitor.add_processor(eeg)

    monitor.acquire_data(ecg, [random.uniform(0, 1)     for _ in range(500)])
    monitor.acquire_data(eeg, [random.uniform(-0.1, 0.1) for _ in range(256)])
    monitor.analyze_all()
    monitor.generate_report()

    # Test __add__
    eeg2 = EEGProcessor(256)
    eeg2.load_data([random.uniform(-0.1,0.1) for _ in range(256)])
    combined = eeg + eeg2
    combined.process_signal()
    print(f"Combined samples: {len(combined.raw_data)}, State: {combined.classify_state()}")
`,
    hints:[
      "💡 ECGProcessor.process_signal: peaks = [v for v in self.raw_data if v > self.threshold]. duration_s = len(self.raw_data)/self.sampling_rate. heart_rate = (len(peaks)/duration_s)*60.",
      "💡 EEGProcessor.process_signal: split raw_data into 4 chunks. For each chunk compute avg absolute amplitude. Normalise to 100% across the 4 bands. Store as {'delta':%, 'theta':%, 'alpha':%, 'beta':%}.",
      "💡 __add__: create new EEGProcessor, call .load_data(self.raw_data + other.raw_data), return it. Raise TypeError if other is not an EEGProcessor."
    ],
    solution:`from abc import ABC, abstractmethod
import random

class BioSignalProcessor(ABC):
    def __init__(self, signal_type, sampling_rate):
        self.signal_type=signal_type; self.sampling_rate=sampling_rate
        self.raw_data=[]; self.results={}
    def load_data(self, data):
        if not isinstance(data,list): raise TypeError("Data must be a list")
        self.raw_data=data
    @abstractmethod
    def process_signal(self): pass
    def __repr__(self): return f"{self.__class__.__name__}(type={self.signal_type}, rate={self.sampling_rate}Hz, samples={len(self.raw_data)})"

class ECGProcessor(BioSignalProcessor):
    def __init__(self, sampling_rate=500):
        super().__init__("ECG",sampling_rate); self.threshold=0.5
    def process_signal(self):
        if not self.raw_data: raise ValueError("No ECG data loaded")
        peaks=[v for v in self.raw_data if v>self.threshold]
        dur=len(self.raw_data)/self.sampling_rate
        hr=(len(peaks)/dur)*60 if dur>0 else 0
        self.results={"qrs_count":len(peaks),"heart_rate":round(hr,1),"duration_s":round(dur,2)}
        return self.results
    def detect_arrhythmia(self):
        hr=self.results.get("heart_rate",70)
        if hr<60: return f"Bradycardia (HR={hr} bpm)"
        if hr>100: return f"Tachycardia (HR={hr} bpm)"
        return f"Normal sinus rhythm (HR={hr} bpm)"

class EEGProcessor(BioSignalProcessor):
    def __init__(self, sampling_rate=256): super().__init__("EEG",sampling_rate)
    def process_signal(self):
        if not self.raw_data: raise ValueError("No EEG data loaded")
        n=len(self.raw_data); q=max(n//4,1)
        chunks=[self.raw_data[i*q:(i+1)*q] for i in range(4)]
        powers=[sum(abs(v) for v in c)/len(c) if c else 0 for c in chunks]
        total=sum(powers) or 1
        self.results={"delta":round(powers[0]/total*100,1),"theta":round(powers[1]/total*100,1),"alpha":round(powers[2]/total*100,1),"beta":round(powers[3]/total*100,1)}
        return self.results
    def classify_state(self):
        if not self.results: return "Not processed"
        dom=max(self.results,key=self.results.get)
        return {"delta":"Deep Sleep","theta":"Drowsy","alpha":"Relaxed","beta":"Alert"}.get(dom,"Unknown")
    def __add__(self, other):
        if not isinstance(other,EEGProcessor): raise TypeError("Can only combine EEGProcessor instances")
        c=EEGProcessor(self.sampling_rate); c.load_data(self.raw_data+other.raw_data); return c

class PatientMonitor:
    def __init__(self, patient_name): self.patient_name=patient_name; self.processors=[]
    def add_processor(self, p):
        if not isinstance(p,BioSignalProcessor): raise TypeError("Must be BioSignalProcessor")
        self.processors.append(p)
    def acquire_data(self, proc, data): proc.load_data(data); print(f"  Acquired {proc.signal_type}: {len(data)} samples")
    def analyze_all(self):
        print(f"\\nAnalysing signals for {self.patient_name}...")
        for p in self.processors:
            try: p.process_signal(); print(f"  ✓ {p.signal_type} processed")
            except Exception as e: print(f"  ✗ {p.signal_type}: {e}")
    def generate_report(self):
        print(f"\\n{'='*50}\\nPATIENT MONITOR — {self.patient_name}\\n{'='*50}")
        for p in self.processors:
            print(f"\\n  [{p.signal_type}] {p}")
            for k,v in p.results.items(): print(f"    {k}: {v}")
            if isinstance(p,ECGProcessor): print(f"    Interpretation: {p.detect_arrhythmia()}")
            if isinstance(p,EEGProcessor): print(f"    Brain state: {p.classify_state()}")
        print("="*50)

if __name__ == "__main__":
    monitor=PatientMonitor("Grace Atieno")
    ecg=ECGProcessor(500); eeg=EEGProcessor(256)
    monitor.add_processor(ecg); monitor.add_processor(eeg)
    monitor.acquire_data(ecg,[random.uniform(0,1) for _ in range(500)])
    monitor.acquire_data(eeg,[random.uniform(-0.1,0.1) for _ in range(256)])
    monitor.analyze_all(); monitor.generate_report()
    eeg2=EEGProcessor(256); eeg2.load_data([random.uniform(-0.1,0.1) for _ in range(256)])
    combined=eeg+eeg2; combined.process_signal()
    print(f"Combined samples: {len(combined.raw_data)}, State: {combined.classify_state()}")`
  },

  q5: {
    id:'q5', icon:'🔬', title:'Drug Formulation & Delivery Optimization System', totalMarks:25,
    concepts:['Abstract Classes','Properties','Custom Exceptions','Magic Methods','Simulation'],
    htmlContent:`
      <h3>Scenario</h3>
      <p>In this lab, you'll model a system at the <strong>Makerere BioNano Lab</strong> for designing and comparing drug delivery vehicles used in cancer treatment. You'll simulate two types: a <em>NanoparticleVehicle</em> carrying Doxorubicin with steady sustained release, and a <em>LiposomeVehicle</em> carrying Cisplatin with a rapid initial burst — then recommend the optimal vehicle for different patient profiles.</p>

      <h3>Objective</h3>
      <p>Fulfill the user stories below and get all the tests to pass to complete the lab.</p>

      <h3>User Stories</h3>

      <h4><span class="part-label">Part a</span> DrugDeliveryVehicle Abstract Base Class <span class="marks-badge">6 marks</span></h4>
      <p>Create an abstract base class named <code>DrugDeliveryVehicle</code>.</p>
      <ul>
        <li>When instantiated, accept <code>vehicle_id</code> (string, e.g. <code>"NP-001"</code>), <code>drug_name</code> (string, e.g. <code>"Doxorubicin"</code>), <code>payload_capacity</code> (float, mg, e.g. 100), and <code>target_tissue</code> (string, e.g. <code>"Tumor"</code>).</li>
        <li>Store payload capacity as a protected attribute <code>self._payload_capacity</code> and current drug load as <code>self._current_load = 0.0</code>.</li>
        <li>Set <code>self._release_rate = 1.0</code> (mg/hr) and <code>self.release_log = []</code>.</li>
        <li>Create a <code>current_load</code> property (getter) returning <code>self._current_load</code>.</li>
        <li>Create a <code>payload_capacity</code> property (getter) returning <code>self._payload_capacity</code>.</li>
        <li>Define <code>load_drug(amount)</code>: raise <code>ValueError</code> for negative amounts. Raise <code>OverloadError</code> if <code>_current_load + amount</code> exceeds <code>_payload_capacity</code>. Otherwise add to <code>_current_load</code> and print a confirmation (e.g. <code>"Loaded 80mg of Doxorubicin into NP-001"</code>).</li>
        <li>Define <code>release_dose(time_hours)</code>: if <code>_current_load</code> is 0 return 0. Compute <code>released = min(self._release_rate * time_hours, self._current_load)</code>. Subtract from <code>_current_load</code>, append to <code>release_log</code>, and return the released amount.</li>
        <li>Define <code>calculate_efficacy()</code> as an abstract method decorated with <code>@abstractmethod</code>.</li>
        <li>Define <code>__str__()</code> returning a summary like <code>NanoparticleVehicle(NP-001) | Doxorubicin | Load:80.0/100mg</code>.</li>
        <li>Implement <code>__eq__(self, other)</code> to compare vehicles by <code>vehicle_id</code>.</li>
        <li>Implement <code>__lt__(self, other)</code> to compare vehicles by their <code>calculate_efficacy()</code> score.</li>
      </ul>

      <h4><span class="part-label">Part b</span> NanoparticleVehicle Subclass <span class="marks-badge">3 marks</span></h4>
      <p>Create <code>NanoparticleVehicle(DrugDeliveryVehicle)</code> — models a nanoparticle carrying Doxorubicin with steady, linear drug release over time.</p>
      <ul>
        <li>Accept an additional parameter <code>release_rate</code> (float, mg/hr, default 2.0) and set <code>self._release_rate = release_rate</code>.</li>
        <li>Inherit <code>release_dose()</code> from the base class (linear: releases <code>rate × hours</code> per call).</li>
        <li>Implement <code>calculate_efficacy()</code>: return a score (0–100) based on (a) what percentage of the payload has been released and (b) how consistently (low variance) it was released. Combine both into a single score.</li>
      </ul>

      <h4><span class="part-label">Part b cont.</span> LiposomeVehicle Subclass <span class="marks-badge">3 marks</span></h4>
      <p>Create <code>LiposomeVehicle(DrugDeliveryVehicle)</code> — models a liposome carrying Cisplatin that releases a large initial burst, then tapers off.</p>
      <ul>
        <li>Accept an additional parameter <code>burst_fraction</code> (float, default 0.6) and set <code>self._burst_done = False</code>.</li>
        <li>Override <code>release_dose(time_hours)</code>: if this is the <strong>first</strong> call (<code>_burst_done is False</code>), release <code>_current_load × burst_fraction</code> (the burst) and set <code>_burst_done = True</code>. On all subsequent calls release a smaller linear amount. Always append to <code>release_log</code> and return the released amount.</li>
        <li>Implement <code>calculate_efficacy()</code>: return a score (0–100) that rewards a large initial burst relative to total released, making this vehicle score well for acute conditions.</li>
      </ul>

      <h4><span class="part-label">Part c</span> FormulationLab Composition <span class="marks-badge">5 marks</span></h4>
      <p>Create a class <code>FormulationLab</code> representing the Makerere BioNano Lab's fleet of delivery vehicles.</p>
      <ul>
        <li>Accept <code>lab_name</code> in <code>__init__</code> (e.g. <code>"Makerere BioNano Lab"</code>). Store vehicles in a private list <code>self._vehicles = []</code>.</li>
        <li>Define <code>add_vehicle(vehicle)</code> to append a vehicle to <code>self._vehicles</code>.</li>
        <li>Define <code>run_simulation(hours=24)</code>: for each vehicle, simulate drug release by calling <code>release_dose(1)</code> once per hour for the given number of hours. After the loop, print the vehicle's total released amount and its efficacy score.</li>
        <li>Define <code>find_optimal_vehicle(patient_profile)</code>: read <code>patient_profile["condition"]</code>. For <code>"acute"</code> conditions (e.g. acute infection or tumour flare), prefer <code>LiposomeVehicle</code> (fast burst). For <code>"chronic"</code> conditions (e.g. long-term cancer maintenance), prefer <code>NanoparticleVehicle</code> (sustained release). Return the vehicle with the highest <code>calculate_efficacy()</code> among the appropriate type.</li>
        <li>Implement <code>__len__</code> to return the number of vehicles.</li>
        <li>Implement <code>__iter__</code> to allow iterating over vehicles with a <code>for</code> loop.</li>
      </ul>

      <h4><span class="part-label">Part d</span> Custom Exceptions &amp; Magic Methods <span class="marks-badge">4 marks</span></h4>
      <ul>
        <li>Define <code>OverloadError(Exception)</code> — raised in <code>load_drug()</code> when adding drug would exceed <code>payload_capacity</code>.</li>
        <li>Define <code>EmptyVehicleError(Exception)</code> — for use when attempting to release from an empty vehicle (optional guard).</li>
        <li>Ensure <code>_payload_capacity</code>, <code>_current_load</code>, and <code>_release_rate</code> are protected attributes accessed through properties.</li>
        <li>Confirm <code>__eq__</code> and <code>__lt__</code> are implemented on <code>DrugDeliveryVehicle</code>.</li>
      </ul>

      <h4><span class="part-label">Part e</span> 24-Hour Simulation <span class="marks-badge">4 marks</span></h4>
      <ul>
        <li>Create a <code>NanoparticleVehicle</code> (<code>"NP-001"</code>, drug <code>"Doxorubicin"</code>, capacity 100 mg, target <code>"Tumor"</code>, release rate 2.0 mg/hr). Load 80 mg.</li>
        <li>Create a <code>LiposomeVehicle</code> (<code>"LP-001"</code>, drug <code>"Cisplatin"</code>, capacity 80 mg, target <code>"Tumor"</code>, burst fraction 0.6). Load 60 mg.</li>
        <li>Add both to a <code>FormulationLab("Makerere BioNano Lab")</code> and call <code>run_simulation(hours=24)</code>.</li>
        <li>Call <code>find_optimal_vehicle()</code> for an acute patient (age 35) and a chronic patient (age 65), and print which vehicle is recommended for each.</li>
      </ul>

      <h3>Usage Example</h3>
      <pre><code>lab  = FormulationLab("Makerere BioNano Lab")

nano = NanoparticleVehicle("NP-001", "Doxorubicin", 100, "Tumor", release_rate=2.0)
lipo = LiposomeVehicle("LP-001",    "Cisplatin",    80,  "Tumor", burst_fraction=0.6)

nano.load_drug(80)   # Loaded 80mg of Doxorubicin into NP-001
lipo.load_drug(60)   # Loaded 60mg of Cisplatin into LP-001

lab.add_vehicle(nano)
lab.add_vehicle(lipo)

lab.run_simulation(hours=24)
# NanoparticleVehicle(NP-001) | Total released: 48.0mg | Efficacy: 74.2/100
# LiposomeVehicle(LP-001)     | Total released: 60.0mg | Efficacy: 62.0/100

best_acute   = lab.find_optimal_vehicle({"age": 35, "condition": "acute"})
best_chronic = lab.find_optimal_vehicle({"age": 65, "condition": "chronic"})
print(f"Acute patient   → {best_acute.vehicle_id}")   # LP-001
print(f"Chronic patient → {best_chronic.vehicle_id}") # NP-001</code></pre>

      <h3>Tests</h3>
      <ol>
        <li>You should define custom exception classes <code>OverloadError</code> and <code>EmptyVehicleError</code>, both extending <code>Exception</code>.</li>
        <li>You should have an abstract <code>DrugDeliveryVehicle</code> class whose <code>__init__</code> sets <code>vehicle_id</code>, <code>drug_name</code>, <code>_payload_capacity</code>, <code>_current_load = 0.0</code>, <code>target_tissue</code>, <code>_release_rate</code>, and <code>release_log = []</code>.</li>
        <li>You should have <code>current_load</code> and <code>payload_capacity</code> as read-only properties on <code>DrugDeliveryVehicle</code>.</li>
        <li>You should have a <code>load_drug(amount)</code> method that raises <code>OverloadError</code> when adding the amount would exceed capacity, and <code>ValueError</code> for negative amounts.</li>
        <li>You should have a <code>release_dose(time_hours)</code> method in the base class that reduces <code>_current_load</code> and appends to <code>release_log</code>.</li>
        <li>You should have <code>calculate_efficacy</code> decorated with <code>@abstractmethod</code> in <code>DrugDeliveryVehicle</code>.</li>
        <li>You should have a <code>__str__()</code> method on <code>DrugDeliveryVehicle</code> that includes vehicle ID, drug name, and current load vs capacity.</li>
        <li>You should implement <code>__eq__</code> (compare by <code>vehicle_id</code>) and <code>__lt__</code> (compare by efficacy) on <code>DrugDeliveryVehicle</code>.</li>
        <li>You should have a <code>NanoparticleVehicle</code> class that inherits from <code>DrugDeliveryVehicle</code> and sets <code>self._release_rate</code> from its <code>release_rate</code> parameter.</li>
        <li><code>NanoparticleVehicle.calculate_efficacy()</code> should return a score based on total released percentage and release consistency.</li>
        <li>You should have a <code>LiposomeVehicle</code> class that inherits from <code>DrugDeliveryVehicle</code> with <code>burst_fraction</code> and <code>_burst_done = False</code>.</li>
        <li><code>LiposomeVehicle.release_dose()</code> should deliver a burst on the first call and smaller linear amounts on subsequent calls.</li>
        <li><code>LiposomeVehicle.calculate_efficacy()</code> should return a score that rewards a large initial burst relative to total released.</li>
        <li>You should have a <code>FormulationLab</code> class whose <code>__init__</code> accepts <code>lab_name</code> and stores vehicles in a private list.</li>
        <li><code>run_simulation(hours)</code> should call <code>release_dose(1)</code> per hour and print total released and efficacy for each vehicle.</li>
        <li><code>find_optimal_vehicle(patient_profile)</code> should return the best-scoring <code>LiposomeVehicle</code> for <code>"acute"</code> and best-scoring <code>NanoparticleVehicle</code> for <code>"chronic"</code>.</li>
        <li>You should implement <code>__len__</code> and <code>__iter__</code> on <code>FormulationLab</code>.</li>
        <li>Your main script should create NP-001 (Doxorubicin) and LP-001 (Cisplatin), load both, run a 24-hour simulation, and print optimal vehicle recommendations for both an acute and a chronic patient.</li>
      </ol>`,
    starterCode:`# Question 5: Drug Formulation & Delivery Optimization System
from abc import ABC, abstractmethod

class OverloadError(Exception): pass
class EmptyVehicleError(Exception): pass

# ── Part a ─────────────────────────────────────────────────────
class DrugDeliveryVehicle(ABC):
    def __init__(self, vehicle_id, drug_name, payload_capacity, target_tissue):
        self.vehicle_id = vehicle_id
        self.drug_name = drug_name
        self._payload_capacity = payload_capacity  # protected
        self._current_load = 0.0
        self.target_tissue = target_tissue
        self._release_rate = 1.0
        self.release_log = []

    @property
    def current_load(self): return self._current_load
    @property
    def payload_capacity(self): return self._payload_capacity

    def load_drug(self, amount):
        pass  # raise OverloadError if exceeds capacity

    def release_dose(self, time_hours):
        pass  # release based on _release_rate; log each call; return released amount

    @abstractmethod
    def calculate_efficacy(self): pass

    def __str__(self):
        return (f"{self.__class__.__name__}({self.vehicle_id}) | {self.drug_name} | "
                f"Load: {self._current_load:.1f}/{self._payload_capacity}mg → {self.target_tissue}")


# ── Part b ─────────────────────────────────────────────────────
class NanoparticleVehicle(DrugDeliveryVehicle):
    def __init__(self, vehicle_id, drug_name, payload_capacity, target_tissue, release_rate=2.0):
        super().__init__(vehicle_id, drug_name, payload_capacity, target_tissue)
        self._release_rate = release_rate

    def release_dose(self, time_hours): pass  # linear: rate * time

    def calculate_efficacy(self): pass


class LiposomeVehicle(DrugDeliveryVehicle):
    def __init__(self, vehicle_id, drug_name, payload_capacity, target_tissue, burst_fraction=0.6):
        super().__init__(vehicle_id, drug_name, payload_capacity, target_tissue)
        self.burst_fraction = burst_fraction
        self._burst_done = False

    def release_dose(self, time_hours): pass  # burst first hour, slow after

    def calculate_efficacy(self): pass


# ── Part c ─────────────────────────────────────────────────────
class FormulationLab:
    def __init__(self, lab_name):
        self.lab_name = lab_name
        self._vehicles = []

    def add_vehicle(self, vehicle): pass
    def run_simulation(self, hours=24): pass
    def find_optimal_vehicle(self, patient_profile): pass

    def __len__(self): return len(self._vehicles)
    def __iter__(self): return iter(self._vehicles)


# ── Part e ─────────────────────────────────────────────────────
if __name__ == "__main__":
    lab = FormulationLab("Makerere BioNano Lab")

    nano = NanoparticleVehicle("NP-001","Doxorubicin",100,"Tumor",release_rate=2.0)
    lipo = LiposomeVehicle("LP-001","Cisplatin",80,"Tumor",burst_fraction=0.6)

    nano.load_drug(80)
    lipo.load_drug(60)

    lab.add_vehicle(nano)
    lab.add_vehicle(lipo)

    lab.run_simulation(hours=24)

    print("\\n=== Optimal Vehicle Selection ===")
    best_acute   = lab.find_optimal_vehicle({"age":35,"condition":"acute"})
    best_chronic = lab.find_optimal_vehicle({"age":65,"condition":"chronic"})
    print(f"Acute patient   → {best_acute}")
    print(f"Chronic patient → {best_chronic}")
`,
    hints:[
      "💡 In load_drug: if self._current_load + amount > self._payload_capacity: raise OverloadError(...). Otherwise self._current_load += amount.",
      "💡 NanoparticleVehicle.release_dose: released = min(self._release_rate * time_hours, self._current_load). Subtract from _current_load and append to release_log.",
      "💡 LiposomeVehicle: on first call (self._burst_done is False), released = self._current_load * self.burst_fraction, then set _burst_done=True. On subsequent calls, release a smaller linear amount."
    ],
    solution:`from abc import ABC, abstractmethod

class OverloadError(Exception): pass
class EmptyVehicleError(Exception): pass

class DrugDeliveryVehicle(ABC):
    def __init__(self, vehicle_id, drug_name, payload_capacity, target_tissue):
        self.vehicle_id=vehicle_id; self.drug_name=drug_name
        self._payload_capacity=payload_capacity; self._current_load=0.0
        self.target_tissue=target_tissue; self._release_rate=1.0; self.release_log=[]
    @property
    def current_load(self): return self._current_load
    @property
    def payload_capacity(self): return self._payload_capacity
    def load_drug(self, amount):
        if amount<0: raise ValueError("Amount cannot be negative")
        if self._current_load+amount>self._payload_capacity:
            raise OverloadError(f"Overload! Cap={self._payload_capacity}, tried {self._current_load+amount:.1f}")
        self._current_load+=amount; print(f"  Loaded {amount}mg of {self.drug_name} into {self.vehicle_id}")
    def release_dose(self, time_hours):
        if self._current_load<=0: return 0
        released=min(self._release_rate*time_hours,self._current_load)
        self._current_load-=released; self.release_log.append(round(released,3)); return released
    @abstractmethod
    def calculate_efficacy(self): pass
    def __str__(self): return f"{self.__class__.__name__}({self.vehicle_id}) | {self.drug_name} | Load:{self._current_load:.1f}/{self._payload_capacity}mg"
    def __repr__(self): return self.__str__()
    def __eq__(self,other): return isinstance(other,DrugDeliveryVehicle) and self.vehicle_id==other.vehicle_id
    def __lt__(self,other): return self.calculate_efficacy()<other.calculate_efficacy()

class NanoparticleVehicle(DrugDeliveryVehicle):
    def __init__(self, vehicle_id, drug_name, payload_capacity, target_tissue, release_rate=2.0):
        super().__init__(vehicle_id,drug_name,payload_capacity,target_tissue); self._release_rate=release_rate
    def release_dose(self, time_hours): return super().release_dose(time_hours)
    def calculate_efficacy(self):
        if not self.release_log: return 0
        total=sum(self.release_log); avg=total/len(self.release_log)
        variance=sum((r-avg)**2 for r in self.release_log)/len(self.release_log)
        consistency=max(0,100-variance*10)
        release_pct=total/self._payload_capacity*100
        return round(min(100,release_pct*0.5+consistency*0.5),1)

class LiposomeVehicle(DrugDeliveryVehicle):
    def __init__(self, vehicle_id, drug_name, payload_capacity, target_tissue, burst_fraction=0.6):
        super().__init__(vehicle_id,drug_name,payload_capacity,target_tissue)
        self.burst_fraction=burst_fraction; self._burst_done=False
    def release_dose(self, time_hours):
        if self._current_load<=0: return 0
        if not self._burst_done:
            released=self._current_load*self.burst_fraction
            self._current_load-=released; self._burst_done=True
        else:
            released=min(self._release_rate*0.5*time_hours,self._current_load)
            self._current_load-=released
        self.release_log.append(round(released,3)); return released
    def calculate_efficacy(self):
        if not self.release_log: return 0
        total=sum(self.release_log); burst=self.release_log[0] if self.release_log else 0
        return round(min(100,(burst/total*100*0.7 if total>0 else 0)+(total/self._payload_capacity*30)),1)

class FormulationLab:
    def __init__(self, lab_name): self.lab_name=lab_name; self._vehicles=[]
    def add_vehicle(self, v): self._vehicles.append(v)
    def __len__(self): return len(self._vehicles)
    def __iter__(self): return iter(self._vehicles)
    def run_simulation(self, hours=24):
        print(f"\\n=== {self.lab_name} — {hours}h Simulation ===")
        for v in self._vehicles:
            print(f"\\n{v}")
            for _ in range(hours): v.release_dose(1)
            print(f"  Total released: {sum(v.release_log):.1f}mg | Efficacy: {v.calculate_efficacy():.1f}/100")
            print(f"  Release profile (first 6h): {v.release_log[:6]}")
    def find_optimal_vehicle(self, patient_profile):
        cond=patient_profile.get("condition","chronic").lower()
        if cond=="acute":
            candidates=[v for v in self._vehicles if isinstance(v,LiposomeVehicle)]
        else:
            candidates=[v for v in self._vehicles if isinstance(v,NanoparticleVehicle)]
        return max(candidates,key=lambda v:v.calculate_efficacy(),default=(self._vehicles[0] if self._vehicles else None))

if __name__ == "__main__":
    lab=FormulationLab("Makerere BioNano Lab")
    nano=NanoparticleVehicle("NP-001","Doxorubicin",100,"Tumor",2.0)
    lipo=LiposomeVehicle("LP-001","Cisplatin",80,"Tumor",0.6)
    nano.load_drug(80); lipo.load_drug(60)
    lab.add_vehicle(nano); lab.add_vehicle(lipo)
    lab.run_simulation(24)
    print("\\n=== Optimal Vehicle Selection ===")
    ba=lab.find_optimal_vehicle({"age":35,"condition":"acute"})
    bc=lab.find_optimal_vehicle({"age":65,"condition":"chronic"})
    print(f"Acute   → {ba.vehicle_id if ba else 'N/A'}")
    print(f"Chronic → {bc.vehicle_id if bc else 'N/A'}")`
  }
};
