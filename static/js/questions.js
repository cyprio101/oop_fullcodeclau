// ═══════════════════════════════════════════════════════════════
//  BioMed OOP Lab — Question Definitions
// ═══════════════════════════════════════════════════════════════

const QUESTIONS = {
  q1: {
    id:'q1', icon:'💉', title:'Smart Insulin Delivery System', totalMarks:25,
    concepts:['Abstract Classes','Inheritance','Polymorphism','Encapsulation','Exception Handling'],
    htmlContent:`
      <h3>Scenario</h3>
      <p>Design an OOP-based simulation for a <strong>smart insulin pump system</strong> used in diabetes management.</p>
      <h3><span class="part-label">Part a</span> Abstract Base Class <span class="marks-badge">5 marks</span></h3>
      <p>Create abstract base class <code>MedicalDevice</code>:</p>
      <ul>
        <li>Attributes: <code>device_id</code>, <code>status</code> (default "active"), <code>battery_level</code> (float 0–100)</li>
        <li>Method: <code>check_battery()</code> returning a status string</li>
        <li>Abstract method: <code>deliver_therapy(patient_data)</code></li>
        <li>Use the <code>abc</code> module</li>
      </ul>
      <h3><span class="part-label">Part b</span> InsulinPump Subclass <span class="marks-badge">6 marks</span></h3>
      <p>Create <code>InsulinPump(MedicalDevice)</code>:</p>
      <ul>
        <li>Attributes: <code>insulin_reservoir</code> (ml), <code>basal_rate</code> (units/hr), <code>bolus_history</code> (list)</li>
        <li>Implement <code>deliver_therapy()</code> — basal + bolus based on glucose; reduce reservoir &amp; battery</li>
      </ul>
      <h3><span class="part-label">Part c</span> Polymorphism <span class="marks-badge">4 marks</span></h3>
      <p>Create <code>GlucoseMonitor(MedicalDevice)</code> that only reads/logs glucose. Demonstrate both devices in a list calling <code>deliver_therapy()</code>.</p>
      <h3><span class="part-label">Part d</span> Encapsulation &amp; Exceptions <span class="marks-badge">5 marks</span></h3>
      <p>Add private attributes + properties/setters; raise exceptions for low battery or empty reservoir.</p>
      <h3><span class="part-label">Part e</span> Main Script <span class="marks-badge">5 marks</span></h3>
      <p>Simulate 5 therapy cycles (glucose 80–250 mg/dL). Print a summary report.</p>`,
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
      <p>Design a system to manage <strong>biomedical equipment inventory</strong> in a hospital.</p>
      <h3><span class="part-label">Part a</span> Equipment Base Class <span class="marks-badge">5 marks</span></h3>
      <p>Define <code>Equipment</code> with: <code>asset_id</code>, <code>name</code>, <code>location</code>, <code>maintenance_due</code> (date string), <code>status</code>. Include <code>__str__()</code>, <code>perform_maintenance()</code>, <code>is_due_for_maintenance()</code>.</p>
      <h3><span class="part-label">Part b</span> Subclasses + Polymorphism <span class="marks-badge">7 marks</span></h3>
      <ul>
        <li><code>ImagingDevice(Equipment)</code> — adds <code>radiation_level</code>, <code>calibration_date</code></li>
        <li><code>MonitoringDevice(Equipment)</code> — adds <code>battery_backup_hours</code></li>
      </ul>
      <p>Override methods where appropriate.</p>
      <h3><span class="part-label">Part c</span> HospitalInventory Composition <span class="marks-badge">6 marks</span></h3>
      <p>Composition-based class with: <code>add_equipment()</code>, <code>remove_equipment()</code>, <code>generate_maintenance_report()</code>, <code>search_by_type()</code>.</p>
      <h3><span class="part-label">Part d</span> Error Handling &amp; Magic Methods <span class="marks-badge">4 marks</span></h3>
      <p>Handle duplicate <code>asset_id</code>. Implement <code>__len__</code> and <code>__getitem__</code>.</p>
      <h3><span class="part-label">Part e</span> Demonstration <span class="marks-badge">3 marks</span></h3>
      <p>Create 4+ devices (mixed types), add to inventory, run maintenance, generate report.</p>`,
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
      <p>Build a system for managing <strong>patient records</strong> linked with personalised <strong>drug delivery schedules</strong>.</p>
      <h3><span class="part-label">Part a</span> Patient Class <span class="marks-badge">6 marks</span></h3>
      <p><code>Patient</code> with: <code>patient_id</code>, <code>name</code>, <code>age</code>, <code>medical_history</code> (list), <code>current_conditions</code> (dict). Methods: <code>add_condition(condition, severity)</code>, <code>update_history(entry)</code>, <code>__repr__()</code>.</p>
      <h3><span class="part-label">Part b</span> Medication Base Class <span class="marks-badge">5 marks</span></h3>
      <p><code>Medication</code> with: <code>drug_name</code>, <code>dosage</code>, <code>frequency</code>, <code>side_effects</code> (list). Method: <code>administer(patient)</code>.</p>
      <h3><span class="part-label">Part c</span> Medication Subclasses <span class="marks-badge">7 marks</span></h3>
      <ul>
        <li><code>InfusionMedication(Medication)</code> — IV drug with <code>infusion_rate</code> (ml/hr)</li>
        <li><code>OralMedication(Medication)</code> — with <code>pill_count</code></li>
      </ul>
      <p>Implement polymorphic <code>administer()</code> with different logging/behaviour.</p>
      <h3><span class="part-label">Part d</span> TreatmentPlan Composition <span class="marks-badge">6 marks</span></h3>
      <p>Composes a <code>Patient</code> + multiple <code>Medication</code> objects. Methods: <code>schedule_dose(medication, time)</code>, <code>check_interactions()</code>, <code>generate_daily_schedule()</code>.</p>
      <h3><span class="part-label">Part e</span> Simulation <span class="marks-badge">6 marks</span></h3>
      <p>2 patients, 3-day simulation, allergy exception handling, detailed logs.</p>`,
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
    def check_interactions(self): pass   # warn if side effects overlap
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
      <p>Simulate OOP design for devices that process <strong>physiological signals</strong> (ECG, EEG).</p>
      <h3><span class="part-label">Part a</span> Abstract BioSignalProcessor <span class="marks-badge">5 marks</span></h3>
      <p>Abstract class with: <code>signal_type</code>, <code>sampling_rate</code>, <code>raw_data</code> (list). Abstract method: <code>process_signal()</code>.</p>
      <h3><span class="part-label">Part b</span> Concrete Subclasses <span class="marks-badge">6 marks</span></h3>
      <ul>
        <li><code>ECGProcessor</code> — detect QRS peaks via threshold method; compute heart rate</li>
        <li><code>EEGProcessor</code> — estimate delta/theta/alpha/beta band power; classify brain state</li>
      </ul>
      <h3><span class="part-label">Part c</span> PatientMonitor Composition <span class="marks-badge">5 marks</span></h3>
      <p>Holds multiple processors + patient reference. Methods: <code>acquire_data()</code>, <code>analyze_all()</code>, <code>generate_report()</code>.</p>
      <h3><span class="part-label">Part d</span> Polymorphism &amp; Magic Methods <span class="marks-badge">4 marks</span></h3>
      <p>Process different signals via the same monitor interface. Implement <code>__add__</code> on <code>EEGProcessor</code> to combine datasets. Add error handling.</p>`,
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
        # count peaks, compute bpm
        pass

    def detect_arrhythmia(self):
        pass  # bradycardia <60, tachycardia >100


class EEGProcessor(BioSignalProcessor):
    def __init__(self, sampling_rate=256):
        super().__init__("EEG", sampling_rate)

    def process_signal(self):
        # split data into 4 equal chunks → proxy for delta/theta/alpha/beta
        pass

    def classify_state(self):
        pass  # dominant band → brain state label

    def __add__(self, other):
        # combine raw_data from two EEGProcessors
        pass


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

    ecg_data = [random.uniform(0, 1)    for _ in range(500)]
    eeg_data = [random.uniform(-0.1, 0.1) for _ in range(256)]

    monitor.acquire_data(ecg, ecg_data)
    monitor.acquire_data(eeg, eeg_data)
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
      <p>Model a system for designing and simulating <strong>drug delivery vehicles</strong> (nanoparticles, liposomes).</p>
      <h3><span class="part-label">Part a</span> DrugDeliveryVehicle Base <span class="marks-badge">6 marks</span></h3>
      <p>Attributes: <code>vehicle_id</code>, <code>drug_name</code>, <code>payload_capacity</code>, <code>current_load</code>, <code>target_tissue</code>. Protected: <code>_release_rate</code>. Methods: <code>load_drug(amount)</code>, <code>release_dose(time)</code>, abstract <code>calculate_efficacy()</code>.</p>
      <h3><span class="part-label">Part b</span> Subclasses <span class="marks-badge">6 marks</span></h3>
      <ul>
        <li><code>NanoparticleVehicle</code> — sustained (linear) release</li>
        <li><code>LiposomeVehicle</code> — burst release (fast initial, tapering off)</li>
      </ul>
      <h3><span class="part-label">Part c</span> FormulationLab Composition <span class="marks-badge">5 marks</span></h3>
      <p>Manages vehicles, runs simulations, finds optimal vehicle for patient profile.</p>
      <h3><span class="part-label">Part d</span> Encapsulation &amp; Magic Methods <span class="marks-badge">4 marks</span></h3>
      <p>Properties, custom <code>OverloadError</code>, two magic methods.</p>
      <h3><span class="part-label">Part e</span> 24-Hour Simulation <span class="marks-badge">4 marks</span></h3>
      <p>Create vehicles, load drugs, run 24h study, compare efficacy, output results.</p>`,
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
        # raise OverloadError if exceeds capacity
        pass

    def release_dose(self, time_hours):
        # release based on _release_rate; log each call; return released amount
        pass

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
