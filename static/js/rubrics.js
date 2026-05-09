// ═══════════════════════════════════════════════════════════════
//  BioMed OOP Lab — Assessment Rubrics
// ═══════════════════════════════════════════════════════════════

const RUBRICS = {
  q1: [
    { id:'abc_import', label:'ABC module imported correctly', marks:1,
      check:`result.score=0;result.feedback="abc module not imported.";
if(code.includes('from abc import')&&code.includes('ABC')&&code.includes('abstractmethod')){result.score=1;result.feedback="abc module imported correctly.";}`
    },
    { id:'medical_device_class', label:'MedicalDevice abstract class defined', marks:2,
      check:`result.score=0;result.feedback="MedicalDevice class not found or not abstract.";
const hasMD=/class\\s+MedicalDevice\\s*\\(\\s*ABC\\s*\\)/.test(code);
const hasInit=code.includes('self.device_id')&&code.includes('self.status');
const hasAbstract=/@abstractmethod/.test(code)&&/def\\s+deliver_therapy/.test(code);
if(hasMD&&hasInit&&hasAbstract){result.score=2;result.feedback="MedicalDevice abstract class correctly defined.";}
else if(hasMD&&hasInit){result.score=1;result.feedback="MedicalDevice found but deliver_therapy is not abstract.";}` 
    },
    { id:'check_battery', label:'check_battery() method implemented', marks:2,
      check:`result.score=0;result.feedback="check_battery() missing or not implemented.";
const hasMethod=/def\\s+check_battery/.test(code);
const seg=code.split('def check_battery')[1]||'';
const hasReturn=/return/.test(seg.split('def ')[0]);
if(hasMethod&&hasReturn){result.score=2;result.feedback="check_battery() implemented and returns a status message.";}
else if(hasMethod){result.score=1;result.feedback="check_battery() defined but may not return a string.";}`
    },
    { id:'insulin_pump', label:'InsulinPump subclass with correct inheritance', marks:3,
      check:`result.score=0;result.feedback="InsulinPump class not found or does not inherit MedicalDevice.";
const hasClass=/class\\s+InsulinPump\\s*\\(\\s*MedicalDevice\\s*\\)/.test(code);
const hasReservoir=code.includes('insulin_reservoir')||code.includes('_insulin_reservoir');
const hasBasal=code.includes('basal_rate');
const hasBolus=code.includes('bolus_history');
if(hasClass&&hasReservoir&&hasBasal&&hasBolus){result.score=3;result.feedback="InsulinPump correctly inherits MedicalDevice with all required attributes.";}
else if(hasClass&&hasReservoir){result.score=2;result.feedback="InsulinPump found but missing basal_rate or bolus_history.";}
else if(hasClass){result.score=1;result.feedback="InsulinPump class found but missing key attributes.";}`
    },
    { id:'deliver_therapy_pump', label:'InsulinPump.deliver_therapy() with bolus logic', marks:3,
      check:`result.score=0;result.feedback="deliver_therapy() not implemented in InsulinPump.";
const pumpSec=code.split('class InsulinPump')[1]?.split('class ')[0]||'';
const hasDeliver=/def\\s+deliver_therapy/.test(pumpSec);
const hasGlucose=pumpSec.includes('glucose');
const hasBolus=pumpSec.includes('bolus');
const hasReduce=pumpSec.includes('-=');
if(hasDeliver&&hasGlucose&&hasBolus&&hasReduce){result.score=3;result.feedback="deliver_therapy() correctly implements basal+bolus logic.";}
else if(hasDeliver&&hasGlucose){result.score=2;result.feedback="deliver_therapy() reads glucose but bolus or reservoir reduction incomplete.";}
else if(hasDeliver){result.score=1;result.feedback="deliver_therapy() defined but glucose/bolus logic not implemented.";}`
    },
    { id:'glucose_monitor', label:'GlucoseMonitor subclass (polymorphism)', marks:4,
      check:`result.score=0;result.feedback="GlucoseMonitor class not found.";
const hasClass=/class\\s+GlucoseMonitor\\s*\\(\\s*MedicalDevice\\s*\\)/.test(code);
const monSec=code.split('class GlucoseMonitor')[1]?.split('class ')[0]||'';
const hasDeliver=/def\\s+deliver_therapy/.test(monSec);
const hasLog=monSec.includes('log')||monSec.includes('print')||monSec.includes('append');
const polyDemo=/devices\\s*=|for.*device.*in/.test(code);
if(hasClass&&hasDeliver&&hasLog&&polyDemo){result.score=4;result.feedback="GlucoseMonitor correct and polymorphism demonstrated with device loop.";}
else if(hasClass&&hasDeliver&&hasLog){result.score=3;result.feedback="GlucoseMonitor implemented but polymorphism loop not found.";}
else if(hasClass&&hasDeliver){result.score=2;result.feedback="GlucoseMonitor found but deliver_therapy doesn't log glucose.";}
else if(hasClass){result.score=1;result.feedback="GlucoseMonitor found but deliver_therapy not implemented.";}`
    },
    { id:'encapsulation', label:'Encapsulation with properties/private attrs', marks:3,
      check:`result.score=0;result.feedback="No encapsulation. Use private attrs (self._x) and @property.";
const hasPrivate=/self\\._[a-z]/.test(code);
const hasProperty=/@property/.test(code);
const hasSetter=/@\\w+\\.setter/.test(code);
if(hasPrivate&&hasProperty&&hasSetter){result.score=3;result.feedback="Excellent: private attrs, @property getter and setter all present.";}
else if(hasPrivate&&hasProperty){result.score=2;result.feedback="Private attrs and @property found. Add a setter for full marks.";}
else if(hasPrivate){result.score=1;result.feedback="Private attrs found. Add @property decorators.";}`
    },
    { id:'exception_handling', label:'Custom exceptions (LowBattery/EmptyReservoir)', marks:4,
      check:`result.score=0;result.feedback="No custom exceptions found.";
const hasCustomExc=/class\\s+\\w+Error\\s*\\(\\s*(Exception|\\w+Error)\\s*\\)/.test(code);
const hasRaise=/raise\\s+\\w+Error/.test(code);
const hasTryCatch=/try:/.test(code)&&/except/.test(code);
if(hasCustomExc&&hasRaise&&hasTryCatch){result.score=4;result.feedback="Custom exceptions defined, raised, and caught in try/except.";}
else if(hasCustomExc&&hasRaise){result.score=3;result.feedback="Custom exceptions defined and raised. Add try/except in main loop.";}
else if(hasRaise||hasTryCatch){result.score=2;result.feedback="Some error handling found. Define custom exception classes.";}
else if(hasCustomExc){result.score=1;result.feedback="Custom exception class found but not raised.";}`
    },
    { id:'main_script', label:'Main simulation (5 cycles + summary report)', marks:3,
      check:`result.score=0;result.feedback="Main simulation not found or incomplete.";
const hasMain=code.includes('if __name__')||(code.includes('pump')&&code.includes('monitor'));
const hasLoop=/for\\s+\\w+\\s+in/.test(code)||/range\\(5\\)/.test(code);
const hasReport=/print.*[Ss]ummary|print.*[Rr]eport|print.*reservoir|print.*history/.test(code);
if(hasMain&&hasLoop&&hasReport){result.score=3;result.feedback="Main script runs simulation loop and prints summary.";}
else if(hasMain&&hasLoop){result.score=2;result.feedback="Loop found but summary report missing.";}
else if(hasMain){result.score=1;result.feedback="Main script started but loop or report missing.";}`
    }
  ],

  q2: [
    { id:'equipment_base', label:'Equipment base class with required attributes', marks:2,
      check:`result.score=0;result.feedback="Equipment class not found or missing attributes.";
const hasClass=/class\\s+Equipment/.test(code);
const hasAttrs=code.includes('asset_id')&&code.includes('location')&&code.includes('maintenance_due')&&code.includes('status');
if(hasClass&&hasAttrs){result.score=2;result.feedback="Equipment class defined with all required attributes.";}
else if(hasClass){result.score=1;result.feedback="Equipment class found but missing some attributes.";}`
    },
    { id:'equipment_methods', label:'__str__, perform_maintenance, is_due_for_maintenance', marks:3,
      check:`result.score=0;result.feedback="Equipment methods not implemented.";
const eqSec=code.split('class Equipment')[1]?.split('class ')[0]||'';
const hasStr=/def\\s+__str__/.test(eqSec)&&/return/.test(eqSec);
const hasMaint=/def\\s+perform_maintenance/.test(eqSec);
const hasDue=/def\\s+is_due_for_maintenance/.test(eqSec);
const hasDate=/date|datetime/.test(eqSec);
if(hasStr&&hasMaint&&hasDue&&hasDate){result.score=3;result.feedback="All three methods with date comparison logic.";}
else if(hasMaint&&hasDue){result.score=2;result.feedback="__str__ or date logic missing.";}
else if(hasMaint||hasDue){result.score=1;result.feedback="Only one method implemented.";}`
    },
    { id:'imaging_device', label:'ImagingDevice subclass with overridden methods', marks:4,
      check:`result.score=0;result.feedback="ImagingDevice subclass not found.";
const hasClass=/class\\s+ImagingDevice\\s*\\(\\s*Equipment\\s*\\)/.test(code);
const imgSec=code.split('class ImagingDevice')[1]?.split('class ')[0]||'';
const hasRad=imgSec.includes('radiation_level');
const hasCal=imgSec.includes('calibration_date');
const hasOverride=/def\\s+perform_maintenance/.test(imgSec);
if(hasClass&&hasRad&&hasCal&&hasOverride){result.score=4;result.feedback="ImagingDevice with radiation_level, calibration_date, overridden perform_maintenance.";}
else if(hasClass&&hasRad&&hasCal){result.score=3;result.feedback="ImagingDevice has extra attrs but perform_maintenance not overridden.";}
else if(hasClass&&(hasRad||hasCal)){result.score=2;result.feedback="ImagingDevice found but missing some attributes.";}
else if(hasClass){result.score=1;result.feedback="ImagingDevice class found but incomplete.";}`
    },
    { id:'monitoring_device', label:'MonitoringDevice subclass', marks:3,
      check:`result.score=0;result.feedback="MonitoringDevice not found.";
const hasClass=/class\\s+MonitoringDevice\\s*\\(\\s*Equipment\\s*\\)/.test(code);
const monSec=code.split('class MonitoringDevice')[1]?.split('class ')[0]||'';
const hasBattery=monSec.includes('battery_backup_hours');
const hasSuper=monSec.includes('super()');
if(hasClass&&hasBattery&&hasSuper){result.score=3;result.feedback="MonitoringDevice correctly inherits Equipment.";}
else if(hasClass&&hasBattery){result.score=2;result.feedback="MonitoringDevice has battery_backup_hours but super() may be missing.";}
else if(hasClass){result.score=1;result.feedback="MonitoringDevice found but incomplete.";}`
    },
    { id:'hospital_inventory', label:'HospitalInventory composition class', marks:3,
      check:`result.score=0;result.feedback="HospitalInventory not found.";
const hasClass=/class\\s+HospitalInventory/.test(code);
const invSec=code.split('class HospitalInventory')[1]?.split('class ')[0]||'';
const hasDict=invSec.includes('{}')||invSec.includes('_equipment');
const hasAdd=/def\\s+add_equipment/.test(invSec);
const hasRemove=/def\\s+remove_equipment/.test(invSec);
if(hasClass&&hasDict&&hasAdd&&hasRemove){result.score=3;result.feedback="HospitalInventory with internal dict and add/remove.";}
else if(hasClass&&hasAdd){result.score=2;result.feedback="HospitalInventory found with add_equipment. remove_equipment may be missing.";}
else if(hasClass){result.score=1;result.feedback="HospitalInventory found but methods incomplete.";}`
    },
    { id:'inventory_methods', label:'generate_maintenance_report + search_by_type', marks:3,
      check:`result.score=0;result.feedback="Report/search methods not found.";
const invSec=code.split('class HospitalInventory')[1]?.split('class ')[0]||'';
const hasReport=/def\\s+generate_maintenance_report/.test(invSec);
const hasSearch=/def\\s+search_by_type/.test(invSec);
const hasIsinstance=invSec.includes('isinstance');
if(hasReport&&hasSearch&&hasIsinstance){result.score=3;result.feedback="Both methods with isinstance() type filtering.";}
else if(hasReport&&hasSearch){result.score=2;result.feedback="Both methods found but search may not use isinstance().";}
else if(hasReport||hasSearch){result.score=1;result.feedback="Only one method found.";}`
    },
    { id:'error_handling', label:'Error handling for duplicate asset_id', marks:2,
      check:`result.score=0;result.feedback="No error handling for duplicate asset_id.";
const hasCheck=/asset_id.*in.*self\\._equipment|asset_id.*in.*self\\.equipment/.test(code);
const hasRaise=/raise\\s+\\w*(Error|Exception)/.test(code);
if(hasCheck&&hasRaise){result.score=2;result.feedback="Duplicate check and exception raise implemented.";}
else if(hasCheck||hasRaise){result.score=1;result.feedback="Partial error handling.";}`
    },
    { id:'magic_methods', label:'__len__ and __getitem__ magic methods', marks:2,
      check:`result.score=0;result.feedback="__len__ and __getitem__ not found.";
const hasLen=/def\\s+__len__/.test(code);
const hasGetItem=/def\\s+__getitem__/.test(code);
if(hasLen&&hasGetItem){result.score=2;result.feedback="Both __len__ and __getitem__ implemented.";}
else if(hasLen||hasGetItem){result.score=1;result.feedback="Only one magic method found.";}`
    },
    { id:'demonstration', label:'Demonstration with 4+ mixed devices', marks:3,
      check:`result.score=0;result.feedback="Demonstration not found or incomplete.";
const imgCount=(code.match(/ImagingDevice\\(/g)||[]).length;
const monCount=(code.match(/MonitoringDevice\\(/g)||[]).length;
const hasReport=code.includes('generate_maintenance_report');
const hasAdd=(code.match(/add_equipment/g)||[]).length>=3;
if(imgCount>=2&&monCount>=2&&hasReport&&hasAdd){result.score=3;result.feedback="Full demo with 4+ mixed devices and maintenance report.";}
else if((imgCount+monCount)>=3&&hasReport){result.score=2;result.feedback="3+ devices with report.";}
else if(hasReport){result.score=1;result.feedback="Report called but fewer than 4 devices created.";}`
    }
  ],

  q3: [
    { id:'patient_class', label:'Patient class with all attributes', marks:3,
      check:`result.score=0;result.feedback="Patient class not found.";
const hasClass=/class\\s+Patient/.test(code);
const patSec=code.split('class Patient')[1]?.split('class ')[0]||'';
const hasId=patSec.includes('patient_id');
const hasHistory=patSec.includes('medical_history');
const hasConditions=patSec.includes('current_conditions');
const hasAllergies=patSec.includes('allerg');
if(hasClass&&hasId&&hasHistory&&hasConditions){result.score=hasAllergies?3:2;result.feedback=hasAllergies?"Patient class with all attributes including allergies.":"Patient class found but allergies list missing.";}
else if(hasClass&&hasId){result.score=1;result.feedback="Patient class found but missing medical_history or current_conditions.";}`
    },
    { id:'patient_methods', label:'add_condition, update_history, __repr__', marks:3,
      check:`result.score=0;result.feedback="Patient methods not implemented.";
const patSec=code.split('class Patient')[1]?.split('class ')[0]||'';
const hasAddCond=/def\\s+add_condition/.test(patSec);
const hasHistory=/def\\s+update_history/.test(patSec);
const hasRepr=/def\\s+__repr__/.test(patSec);
const score=[hasAddCond,hasHistory,hasRepr].filter(Boolean).length;
result.score=score;result.feedback=score===3?"All Patient methods implemented.":score+"/3 Patient methods found.";`
    },
    { id:'medication_base', label:'Medication base class with administer()', marks:3,
      check:`result.score=0;result.feedback="Medication base class not found.";
const hasClass=/class\\s+Medication/.test(code);
const medSec=code.split('class Medication')[1]?.split('class ')[0]||'';
const hasAdmin=/def\\s+administer/.test(medSec);
const hasAttrs=medSec.includes('drug_name')&&medSec.includes('dosage');
const hasSideEff=medSec.includes('side_effect');
if(hasClass&&hasAdmin&&hasAttrs&&hasSideEff){result.score=3;result.feedback="Medication base class complete.";}
else if(hasClass&&hasAdmin&&hasAttrs){result.score=2;result.feedback="Medication class found. side_effects may be missing.";}
else if(hasClass&&hasAdmin){result.score=1;result.feedback="Medication and administer() found but attributes incomplete.";}`
    },
    { id:'allergy_check', label:'Allergy check + AllergyError exception', marks:2,
      check:`result.score=0;result.feedback="AllergyError or allergy check not found.";
const hasAllergyErr=/class\\s+AllergyError/.test(code);
const hasCheck=code.includes('_allergies')||code.includes('allerg');
const hasRaise=/raise\\s+AllergyError/.test(code);
if(hasAllergyErr&&hasCheck&&hasRaise){result.score=2;result.feedback="AllergyError defined and raised correctly.";}
else if(hasAllergyErr||hasRaise){result.score=1;result.feedback="Partial allergy handling.";}`
    },
    { id:'infusion_medication', label:'InfusionMedication with polymorphic administer()', marks:4,
      check:`result.score=0;result.feedback="InfusionMedication not found.";
const hasClass=/class\\s+InfusionMedication\\s*\\(\\s*Medication\\s*\\)/.test(code);
const infSec=code.split('class InfusionMedication')[1]?.split('class ')[0]||'';
const hasRate=infSec.includes('infusion_rate');
const hasAdmin=/def\\s+administer/.test(infSec);
const hasLog=infSec.includes('print')||infSec.includes('IV');
if(hasClass&&hasRate&&hasAdmin&&hasLog){result.score=4;result.feedback="InfusionMedication with infusion_rate and distinct administer().";}
else if(hasClass&&hasRate&&hasAdmin){result.score=3;result.feedback="InfusionMedication found. administer() could show more IV-specific behaviour.";}
else if(hasClass&&hasRate){result.score=2;result.feedback="InfusionMedication has infusion_rate but administer() not overridden.";}
else if(hasClass){result.score=1;result.feedback="InfusionMedication found but incomplete.";}`
    },
    { id:'oral_medication', label:'OralMedication with pill_count tracking', marks:3,
      check:`result.score=0;result.feedback="OralMedication not found.";
const hasClass=/class\\s+OralMedication\\s*\\(\\s*Medication\\s*\\)/.test(code);
const oralSec=code.split('class OralMedication')[1]?.split('class ')[0]||'';
const hasPills=oralSec.includes('pill_count');
const hasAdmin=/def\\s+administer/.test(oralSec);
const hasDecrement=oralSec.includes('-=')||oralSec.includes('- 1');
if(hasClass&&hasPills&&hasAdmin&&hasDecrement){result.score=3;result.feedback="OralMedication with pill tracking and administer().";}
else if(hasClass&&hasPills&&hasAdmin){result.score=2;result.feedback="OralMedication found but pill_count not decremented.";}
else if(hasClass&&hasPills){result.score=1;result.feedback="OralMedication found but administer() not implemented.";}`
    },
    { id:'treatment_plan', label:'TreatmentPlan composition class', marks:4,
      check:`result.score=0;result.feedback="TreatmentPlan class not found.";
const hasClass=/class\\s+TreatmentPlan/.test(code);
const tpSec=code.split('class TreatmentPlan')[1]?.split('class ')[0]||'';
const hasPatient=tpSec.includes('self.patient');
const hasSchedule=/def\\s+schedule_dose/.test(tpSec);
const hasInteract=/def\\s+check_interactions/.test(tpSec);
const hasGenerate=/def\\s+generate_daily_schedule/.test(tpSec);
const count=[hasPatient,hasSchedule,hasInteract,hasGenerate].filter(Boolean).length;
result.score=count;result.feedback=count===4?"TreatmentPlan fully implemented.":count+"/4 components found.";`
    },
    { id:'simulation', label:'3-day simulation with exception handling', marks:6,
      check:`result.score=0;result.feedback="3-day simulation not found.";
const hasPatients=(code.match(/Patient\\(/g)||[]).length>=2;
const hasPlans=(code.match(/TreatmentPlan\\(/g)||[]).length>=2;
const hasLoop=/range\\(.*3|for.*day.*in/.test(code);
const hasTry=/try:/.test(code);
const hasExcept=/except.*AllergyError|except.*Error/.test(code);
const score=[hasPatients,hasPlans,hasLoop,hasTry,hasExcept].filter(Boolean).length;
result.score=Math.round(score/5*6);result.feedback=score>=4?"3-day simulation complete.":"Simulation partially implemented ("+score+"/5 components).";`
    }
  ],

  q4: [
    { id:'abstract_processor', label:'BioSignalProcessor abstract class', marks:3,
      check:`result.score=0;result.feedback="BioSignalProcessor abstract class not found.";
const hasClass=/class\\s+BioSignalProcessor\\s*\\(\\s*ABC\\s*\\)/.test(code);
const bsSec=code.split('class BioSignalProcessor')[1]?.split('class ')[0]||'';
const hasAttrs=bsSec.includes('signal_type')&&bsSec.includes('sampling_rate')&&bsSec.includes('raw_data');
const hasAbstract=/@abstractmethod/.test(bsSec)&&/def\\s+process_signal/.test(bsSec);
if(hasClass&&hasAttrs&&hasAbstract){result.score=3;result.feedback="BioSignalProcessor correctly defined.";}
else if(hasClass&&hasAttrs){result.score=2;result.feedback="BioSignalProcessor found but process_signal not abstract.";}
else if(hasClass){result.score=1;result.feedback="Class found but incomplete.";}`
    },
    { id:'processor_load', label:'load_data() and __repr__ implemented', marks:2,
      check:`result.score=0;result.feedback="load_data() or __repr__ not found.";
const bsSec=code.split('class BioSignalProcessor')[1]?.split('class ')[0]||'';
const hasLoad=/def\\s+load_data/.test(bsSec);
const hasRepr=/def\\s+__repr__/.test(bsSec);
if(hasLoad&&hasRepr){result.score=2;result.feedback="load_data() and __repr__ implemented.";}
else if(hasLoad||hasRepr){result.score=1;result.feedback="Only one of load_data/__repr__ found.";}`
    },
    { id:'ecg_processor', label:'ECGProcessor with QRS detection and heart rate', marks:3,
      check:`result.score=0;result.feedback="ECGProcessor not found.";
const hasClass=/class\\s+ECGProcessor/.test(code);
const ecgSec=code.split('class ECGProcessor')[1]?.split('class ')[0]||'';
const hasProcess=/def\\s+process_signal/.test(ecgSec);
const hasHR=ecgSec.includes('heart_rate')||ecgSec.includes('bpm');
const hasArrhythmia=/def\\s+detect_arrhythmia/.test(ecgSec);
if(hasClass&&hasProcess&&hasHR&&hasArrhythmia){result.score=3;result.feedback="ECGProcessor with QRS, heart rate, and arrhythmia detection.";}
else if(hasClass&&hasProcess&&hasHR){result.score=2;result.feedback="ECGProcessor found. detect_arrhythmia() may be missing.";}
else if(hasClass&&hasProcess){result.score=1;result.feedback="ECGProcessor.process_signal() found but heart rate calculation incomplete.";}`
    },
    { id:'eeg_processor', label:'EEGProcessor with band power and brain state', marks:3,
      check:`result.score=0;result.feedback="EEGProcessor not found.";
const hasClass=/class\\s+EEGProcessor/.test(code);
const eegSec=code.split('class EEGProcessor')[1]?.split('class ')[0]||'';
const hasProcess=/def\\s+process_signal/.test(eegSec);
const hasBands=eegSec.includes('delta')||eegSec.includes('alpha');
const hasClassify=/def\\s+classify_state/.test(eegSec);
if(hasClass&&hasProcess&&hasBands&&hasClassify){result.score=3;result.feedback="EEGProcessor with band power and classify_state().";}
else if(hasClass&&hasProcess&&hasBands){result.score=2;result.feedback="EEGProcessor with bands. classify_state() may be missing.";}
else if(hasClass&&hasProcess){result.score=1;result.feedback="EEGProcessor found but band logic incomplete.";}`
    },
    { id:'patient_monitor', label:'PatientMonitor composition with all methods', marks:5,
      check:`result.score=0;result.feedback="PatientMonitor not found.";
const hasClass=/class\\s+PatientMonitor/.test(code);
const pmSec=code.split('class PatientMonitor')[1]?.split('class ')[0]||'';
const hasAcquire=/def\\s+acquire_data/.test(pmSec);
const hasAnalyze=/def\\s+analyze_all/.test(pmSec);
const hasReport=/def\\s+generate_report/.test(pmSec);
const hasProcs=pmSec.includes('processors')||pmSec.includes('processor');
const count=[hasAcquire,hasAnalyze,hasReport,hasProcs].filter(Boolean).length;
result.score=Math.round(count/4*5);result.feedback=count===4?"PatientMonitor fully implemented.":count+"/4 components found.";`
    },
    { id:'add_magic', label:'__add__ magic method on EEGProcessor', marks:2,
      check:`result.score=0;result.feedback="__add__ not found on EEGProcessor.";
const eegSec=code.split('class EEGProcessor')[1]?.split('class ')[0]||'';
const hasAdd=/def\\s+__add__/.test(eegSec);
const hasCombine=eegSec.includes('raw_data')&&(eegSec.includes('+')||eegSec.includes('extend'));
if(hasAdd&&hasCombine){result.score=2;result.feedback="__add__ correctly combines raw_data.";}
else if(hasAdd){result.score=1;result.feedback="__add__ defined but may not correctly combine raw_data.";}`
    },
    { id:'poly_demo', label:'Polymorphism demonstrated + error handling', marks:2,
      check:`result.score=0;result.feedback="Polymorphism demo or error handling not found.";
const hasPoly=/for.*proc|for.*processor|analyze_all/.test(code);
const hasError=/try:|except/.test(code);
if(hasPoly&&hasError){result.score=2;result.feedback="Polymorphism demonstrated with try/except.";}
else if(hasPoly||hasError){result.score=1;result.feedback="Partial: loop or error handling present.";}`
    }
  ],

  q5: [
    { id:'base_vehicle', label:'DrugDeliveryVehicle abstract class', marks:3,
      check:`result.score=0;result.feedback="DrugDeliveryVehicle abstract class not found.";
const hasClass=/class\\s+DrugDeliveryVehicle\\s*\\(\\s*ABC\\s*\\)/.test(code);
const dvSec=code.split('class DrugDeliveryVehicle')[1]?.split('class ')[0]||'';
const hasAttrs=dvSec.includes('vehicle_id')&&dvSec.includes('payload_capacity')&&dvSec.includes('target_tissue');
const hasProtected=dvSec.includes('_release_rate')||dvSec.includes('_payload_capacity');
const hasAbstract=/@abstractmethod/.test(dvSec);
if(hasClass&&hasAttrs&&hasProtected&&hasAbstract){result.score=3;result.feedback="Abstract base class with protected attributes and abstract method.";}
else if(hasClass&&hasAttrs){result.score=2;result.feedback="Base class found but protected attrs or abstract method may be missing.";}
else if(hasClass){result.score=1;result.feedback="Class found but significantly incomplete.";}`
    },
    { id:'vehicle_methods', label:'load_drug() and release_dose() implemented', marks:3,
      check:`result.score=0;result.feedback="load_drug() or release_dose() not found.";
const dvSec=code.split('class DrugDeliveryVehicle')[1]?.split('class ')[0]||'';
const hasLoad=/def\\s+load_drug/.test(dvSec);
const hasRelease=/def\\s+release_dose/.test(dvSec);
const hasLog=dvSec.includes('release_log');
if(hasLoad&&hasRelease&&hasLog){result.score=3;result.feedback="load_drug(), release_dose(), and release_log all implemented.";}
else if(hasLoad&&hasRelease){result.score=2;result.feedback="Both methods found but release_log may be missing.";}
else if(hasLoad||hasRelease){result.score=1;result.feedback="Only one method implemented.";}`
    },
    { id:'nanoparticle', label:'NanoparticleVehicle with sustained release', marks:3,
      check:`result.score=0;result.feedback="NanoparticleVehicle not found.";
const hasClass=/class\\s+NanoparticleVehicle/.test(code);
const npSec=code.split('class NanoparticleVehicle')[1]?.split('class ')[0]||'';
const hasRelease=/def\\s+release_dose/.test(npSec);
const hasEfficacy=/def\\s+calculate_efficacy/.test(npSec);
if(hasClass&&hasRelease&&hasEfficacy){result.score=3;result.feedback="NanoparticleVehicle with sustained release and efficacy.";}
else if(hasClass&&(hasRelease||hasEfficacy)){result.score=2;result.feedback="NanoparticleVehicle partially implemented.";}
else if(hasClass){result.score=1;result.feedback="NanoparticleVehicle class found but incomplete.";}`
    },
    { id:'liposome', label:'LiposomeVehicle with burst release profile', marks:3,
      check:`result.score=0;result.feedback="LiposomeVehicle not found.";
const hasClass=/class\\s+LiposomeVehicle/.test(code);
const lpSec=code.split('class LiposomeVehicle')[1]?.split('class ')[0]||'';
const hasBurst=lpSec.includes('burst_fraction')||lpSec.includes('burst');
const hasRelease=/def\\s+release_dose/.test(lpSec);
const hasEfficacy=/def\\s+calculate_efficacy/.test(lpSec);
if(hasClass&&hasBurst&&hasRelease&&hasEfficacy){result.score=3;result.feedback="LiposomeVehicle with burst release and efficacy.";}
else if(hasClass&&hasBurst&&hasRelease){result.score=2;result.feedback="LiposomeVehicle found. calculate_efficacy may be missing.";}
else if(hasClass&&hasBurst){result.score=1;result.feedback="LiposomeVehicle found but release logic incomplete.";}`
    },
    { id:'formulation_lab', label:'FormulationLab composition class', marks:3,
      check:`result.score=0;result.feedback="FormulationLab class not found.";
const hasClass=/class\\s+FormulationLab/.test(code);
const flSec=code.split('class FormulationLab')[1]?.split('class ')[0]||'';
const hasSim=/def\\s+run_simulation/.test(flSec);
const hasOptimal=/def\\s+find_optimal_vehicle/.test(flSec);
const hasAdd=/def\\s+add_vehicle/.test(flSec);
if(hasClass&&hasSim&&hasOptimal&&hasAdd){result.score=3;result.feedback="FormulationLab fully implemented.";}
else if(hasClass&&(hasSim||hasOptimal)){result.score=2;result.feedback="FormulationLab partially implemented.";}
else if(hasClass){result.score=1;result.feedback="FormulationLab found but methods missing.";}`
    },
    { id:'properties', label:'Properties for encapsulation', marks:2,
      check:`result.score=0;result.feedback="No @property decorators on vehicle attributes.";
const hasProperty=/@property/.test(code);
const hasProtected=/self\\._payload|self\\._current_load|self\\._release/.test(code);
if(hasProperty&&hasProtected){result.score=2;result.feedback="Properties implemented for protected vehicle attributes.";}
else if(hasProtected){result.score=1;result.feedback="Protected attrs found but no @property decorator.";}`
    },
    { id:'custom_exceptions', label:'OverloadError (and EmptyVehicleError)', marks:2,
      check:`result.score=0;result.feedback="OverloadError not found.";
const hasOverload=/class\\s+OverloadError/.test(code);
const hasRaise=/raise\\s+OverloadError/.test(code);
const hasEmpty=/class\\s+EmptyVehicleError/.test(code);
if(hasOverload&&hasRaise&&hasEmpty){result.score=2;result.feedback="Both OverloadError and EmptyVehicleError defined and used.";}
else if(hasOverload&&hasRaise){result.score=1;result.feedback="OverloadError defined and raised. Consider adding EmptyVehicleError.";}`
    },
    { id:'magic_methods_v5', label:'At least two magic methods', marks:2,
      check:`result.score=0;result.feedback="Magic methods not found.";
const magics=['__len__','__iter__','__eq__','__lt__','__str__','__repr__','__add__'];
const found=magics.filter(m=>code.includes('def '+m));
if(found.length>=2){result.score=2;result.feedback="Magic methods found: "+found.join(', ')+".";}
else if(found.length===1){result.score=1;result.feedback="Only one magic method ("+found[0]+"). Add at least one more.";}`
    },
    { id:'simulation_24h', label:'24-hour simulation with efficacy comparison', marks:4,
      check:`result.score=0;result.feedback="24-hour simulation not found.";
const hasVehicles=(code.match(/NanoparticleVehicle\\(|LiposomeVehicle\\(/g)||[]).length>=2;
const hasLoad=(code.match(/load_drug\\(/g)||[]).length>=2;
const hasSim=code.includes('run_simulation')||/range\\(24\\)|hours.*24/.test(code);
const hasCompare=code.includes('find_optimal_vehicle')||code.includes('efficacy')||code.includes('calculate_efficacy');
const count=[hasVehicles,hasLoad,hasSim,hasCompare].filter(Boolean).length;
result.score=count;result.feedback=count===4?"24h simulation complete.":count+"/4 simulation components found.";`
    }
  ]
};
