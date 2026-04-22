from __future__ import annotations
from typing import Optional, Union
from pydantic import BaseModel


class Talisman(BaseModel):
    name: str
    effect_ingame: str
    effect: str
    notes: Optional[str] = None


class RelicPassive(BaseModel):
    category: str
    description: str
    effect: str
    stackable: Optional[str] = None
    notes: Optional[str] = None
    character: Optional[str] = None  # None = generic, set for character-specific
    source: str  # "generic_relic" | "weapon_passive" | "deep_relic" | "deep_weapon"


class DormantPower(BaseModel):
    category: str
    name: str
    description_ingame: str
    effect: str
    stackable: Optional[str] = None
    notes: Optional[str] = None


class CharacterLevelStats(BaseModel):
    level: int
    vigor: Optional[float] = None
    mind: Optional[float] = None
    endurance: Optional[float] = None
    strength: Optional[float] = None
    dexterity: Optional[float] = None
    intelligence: Optional[float] = None
    faith: Optional[float] = None
    arcane: Optional[float] = None
    phys_neg: Optional[float] = None
    slash_neg: Optional[float] = None
    strike_neg: Optional[float] = None
    thrust_neg: Optional[float] = None
    magic_neg: Optional[float] = None
    fire_neg: Optional[float] = None
    lightning_neg: Optional[float] = None
    holy_neg: Optional[float] = None
    poison_resist: Optional[float] = None
    rot_resist: Optional[float] = None
    bleed_resist: Optional[float] = None
    frost_resist: Optional[float] = None
    sleep_resist: Optional[float] = None
    madness_resist: Optional[float] = None
    blight_resist: Optional[float] = None
    poise: Optional[float] = None


class CharacterBaseStats(BaseModel):
    base_hp: float
    base_fp: float
    base_stamina: float
    vigor: float
    mind: float
    endurance: float
    strength: float
    dexterity: float
    intelligence: float
    faith: float
    arcane: float
    phys_neg: float
    slash_neg: float
    strike_neg: float
    thrust_neg: float
    magic_neg: float
    fire_neg: float
    lightning_neg: float
    holy_neg: float
    poison_resist: float
    rot_resist: float
    bleed_resist: float
    frost_resist: float
    sleep_resist: float
    madness_resist: float
    blight_resist: float
    poise: float


class Character(BaseModel):
    name: str
    base_stats: CharacterBaseStats
    level_stats: list[CharacterLevelStats]


class BossResistances(BaseModel):
    phys_neg: Optional[float] = None
    phys_mod: Optional[float] = None
    strike_neg: Optional[float] = None
    strike_mod: Optional[float] = None
    slash_neg: Optional[float] = None
    slash_mod: Optional[float] = None
    pierce_neg: Optional[float] = None
    pierce_mod: Optional[float] = None
    magic_neg: Optional[float] = None
    magic_mod: Optional[float] = None
    fire_neg: Optional[float] = None
    fire_mod: Optional[float] = None
    lightning_neg: Optional[float] = None
    lightning_mod: Optional[float] = None
    holy_neg: Optional[float] = None
    holy_mod: Optional[float] = None
    poison: Optional[Union[float, str]] = None
    rot: Optional[Union[float, str]] = None
    bleed: Optional[Union[float, str]] = None
    frost: Optional[Union[float, str]] = None
    sleep: Optional[Union[float, str]] = None
    madness: Optional[Union[float, str]] = None
    blight: Optional[Union[float, str]] = None
    poise: Optional[Union[float, str]] = None


class BossHP(BaseModel):
    standard_solo: Optional[float] = None
    standard_duo: Optional[float] = None
    standard_trio: Optional[float] = None
    dlc_solo: Optional[float] = None
    dlc_duo: Optional[float] = None
    dlc_trio: Optional[float] = None


class BuildRecommendation(BaseModel):
    character: str
    relics: list[str]


class Boss(BaseModel):
    name: str
    game_id: Optional[float] = None
    hp: BossHP
    resistances: BossResistances
    build_recommendations: list[BuildRecommendation]


class Consumable(BaseModel):
    name: str
    effect_ingame: str
    effect: str
    duration: Optional[str] = None
    notes: Optional[str] = None


class LevelCost(BaseModel):
    level: int
    runes_to_next: Optional[float] = None
    cost_increase: Optional[float] = None
    total_runes: float


class Meta(BaseModel):
    version: str
    last_updated: str
    dlc_included: bool
    source: str
