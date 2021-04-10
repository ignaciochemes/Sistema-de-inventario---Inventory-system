void main()
{
	//INIT WEATHER BEFORE ECONOMY INIT------------------------
	Weather weather = g_Game.GetWeather();

	weather.MissionWeather(false);    // false = use weather controller from Weather.c

	weather.GetOvercast().Set( Math.RandomFloatInclusive(0.4, 0.6), 1, 0);
	weather.GetRain().Set( 0, 0, 1);
	weather.GetFog().Set( Math.RandomFloatInclusive(0.05, 0.1), 1, 0);

	//INIT ECONOMY--------------------------------------
	Hive ce = CreateHive();
	if ( ce )
		ce.InitOffline();


	//DATE RESET AFTER ECONOMY INIT-------------------------
	int year, month, day, hour, minute;
	int reset_month = 9, reset_day = 20;
	GetGame().GetWorld().GetDate(year, month, day, hour, minute);

    if ((month == reset_month) && (day < reset_day))
    {
        GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
    }
    else
    {
        if ((month == reset_month + 1) && (day > reset_day))
        {
            GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
        }
        else
        {
            if ((month < reset_month) || (month > reset_month + 1))
            {
                GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
            }
        }
 }
  //  SpawnSedans();
}

class CustomMission: MissionServer
{
	void SetRandomHealth(EntityAI itemEnt)
	{
		if ( itemEnt )
		{
			float rndHlt = Math.RandomFloat( 0.25, 0.65 )
			itemEnt.SetHealth01( "", "", rndHlt );
		}
	}

	override PlayerBase CreateCharacter(PlayerIdentity identity, vector pos, ParamsReadContext ctx, string characterName)
	//Se crea el personaje
    {
		Entity playerEnt;
		playerEnt = GetGame().CreatePlayer( identity, characterName, pos, 0, "NONE" );
		Class.CastTo( m_player, playerEnt );

		GetGame().SelectPlayer( identity, m_player );

		return m_player;
	}
    //Creamos las diferentes clases con los objetos
	override void diferentesClases(PlayerBase player, bool clothesChosen)
	{
    player.RemoveAllItems();

	switch (Math.RandomInt(0, 11)) { 
        case 0:
        // franco
        player.GetInventory().CreateInInventory("LeatherStorageVest_Black");
        player.GetInventory().CreateInInventory("HuntingJacket_Summer");
        player.GetInventory().CreateInInventory("HunterPants_Winter");
        player.GetInventory().CreateInInventory("CombatBoots_Black");
        player.GetInventory().CreateInInventory("BallisticHelmet_Black");
        break;

        case 1: 
        // asalto 1
        ItemBase boom = player.GetInventory().CreateInInventory("PlateCarrierVest"); 
        boom.GetInventory().CreateAttachment("PlateCarrierHolster");
        boom.GetInventory().CreateAttachment("PlateCarrierPouches");
        player.GetInventory().CreateInInventory("ParamedicJacket_Green");
        player.GetInventory().CreateInInventory("ParamedicPants_Green");
        player.GetInventory().CreateInInventory("WorkingBoots_Yellow");
        player.GetInventory().CreateInInventory("BandageDressing");
        player.GetInventory().CreateInInventory("HuntingBag");
        player.GetInventory().CreateInInventory("BallisticHelmet_Green");
        break;

        case 2: 
        // g
        player.GetInventory().CreateInInventory("HighCapacityVest_Black");
        player.GetInventory().CreateInInventory("HuntingJacket_Spring");
        player.GetInventory().CreateInInventory("TTSKOPants");
        player.GetInventory().CreateInInventory("HikingBoots_Black");
        ItemBase gorka = player.GetInventory().CreateInInventory("GorkaHelmet");
        gorka.GetInventory().CreateAttachment("GorkaHelmetVisor");
        break; 

		case 3: 
	    // Biker
        ItemBase boom1 = player.GetInventory().CreateInInventory("PlateCarrierVest");
        boom1.GetInventory().CreateAttachment("PlateCarrierHolster");
        boom1.GetInventory().CreateAttachment("PlateCarrierPouches");
        player.GetInventory().CreateInInventory("HuntingJacket_Brown");
        player.GetInventory().CreateInInventory("USMCPants_Woodland");
        player.GetInventory().CreateInInventory("AssaultBag_Ttsko");
        player.GetInventory().CreateInInventory("WorkingBoots_Yellow");
        player.GetInventory().CreateInInventory("BallisticHelmet_Black");
	    break; 

		case 4: 
        // Hiker
        player.GetInventory().CreateInInventory("HighCapacityVest_Olive");
        player.GetInventory().CreateInInventory("HuntingJacket_Summer");
        player.GetInventory().CreateInInventory("CargoPants_Blue");
        player.GetInventory().CreateInInventory("SmershBag");
        player.GetInventory().CreateInInventory("HikingBootsLow_Blue");
        break; 

        case 5: 
        // Cop
        player.GetInventory().CreateInInventory("LeatherStorageVest_Black");
        player.GetInventory().CreateInInventory("HuntingJacket_Winter");
        player.GetInventory().CreateInInventory("USMCPants_Woodland");
        player.GetInventory().CreateInInventory("HikingBootsLow_Blue");
        player.GetInventory().CreateInInventory("BallisticHelmet_Black");
        break; 

        case 6: 
        // Lumberjack
        player.GetInventory().CreateInInventory("UKAssVest_Camo");
        player.GetInventory().CreateInInventory("HuntingJacket_Brown");
        player.GetInventory().CreateInInventory("TTSKOPants");
        player.GetInventory().CreateInInventory("AthleticShoes_Grey");
        player.GetInventory().CreateInInventory("AssaultBag_Ttsko");
        ItemBase gorka1 = player.GetInventory().CreateInInventory("GorkaHelmet");
        gorka1.GetInventory().CreateAttachment("GorkaHelmetVisor");
        break;

        case 7: 
        // Hood
        player.GetInventory().CreateInInventory("HighCapacityVest_Olive");
        player.GetInventory().CreateInInventory("FirefighterJacket_Beige");
        player.GetInventory().CreateInInventory("USMCPants_Woodland");
        player.GetInventory().CreateInInventory("AthleticShoes_Black");
        player.GetInventory().CreateInInventory("KitchenKnife");
        player.GetInventory().CreateInInventory("AliceBag_Camo");
        ItemBase gorka2 = player.GetInventory().CreateInInventory("GorkaHelmet");
        gorka2.GetInventory().CreateAttachment("GorkaHelmetVisor");
        break;

        case 8: 
        // Fireman
        ItemBase boom2 = player.GetInventory().CreateInInventory("PlateCarrierVest");
        boom2.GetInventory().CreateAttachment("PlateCarrierHolster");
        boom2.GetInventory().CreateAttachment("PlateCarrierPouches");
        player.GetInventory().CreateInInventory("FirefighterJacket_Beige");
        player.GetInventory().CreateInInventory("FirefightersPants_Beige");
        player.GetInventory().CreateInInventory("FirefightersHelmet_White");
        player.GetInventory().CreateInInventory("WorkingBoots_Yellow");
        break; 
        
        case 9:
        player.GetInventory().CreateInInventory("GhillieSuit_Mossy");
        player.GetInventory().CreateInInventory("GhillieHood_Mossy");
        player.GetInventory().CreateInInventory("SmershVest");
        player.GetInventory().CreateInInventory("HuntingJacket_Spring");
        player.GetInventory().CreateInInventory("HunterPants_Spring");
        player.GetInventory().CreateInInventory("CombatBoots_Grey");
        
        break;
        case 10: 
        // Hiker
        ItemBase boom3 = player.GetInventory().CreateInInventory("PlateCarrierVest");
        boom3.GetInventory().CreateAttachment("PlateCarrierHolster");
        boom3.GetInventory().CreateAttachment("PlateCarrierPouches");
        player.GetInventory().CreateInInventory("HikingJacket_Red"); 
        player.GetInventory().CreateInInventory("CargoPants_Blue");
        player.GetInventory().CreateInInventory("HikingBootsLow_Blue");
        player.GetInventory().CreateInInventory("MountainBag_Blue");
        player.GetInventory().CreateInInventory("BallisticHelmet_Green");
        break; 
    }

	
        ItemBase BUMBUMChao = player.GetInventory().CreateInInventory("LandMineTrap");

        ItemBase BUM = player.GetInventory().CreateInInventory("M67Grenade");
        
        ItemBase BUM2 = player.GetInventory().CreateInInventory("M67Grenade");
         
      
        ItemBase agua = player.GetInventory().CreateInInventory("MilitaryBelt");
        agua.GetInventory().CreateAttachment("Canteen");
		ItemBase H2O = agua.GetInventory().CreateAttachment("Canteen");
		
		ItemBase rags = player.GetInventory().CreateInInventory("Rag");
		rags.SetQuantity(4);
	    
        ItemBase mor = player.GetInventory().CreateInInventory("Morphine"); 
		mor.SetQuantity(1); 
        
        ItemBase mega = player.GetInventory().CreateInInventory("Megaphone");
        mega.GetInventory().CreateAttachment("Battery9V");

       	EntityAI fn = player.GetHumanInventory().CreateInInventory("FNX45");
		fn.GetInventory().CreateAttachment("PistolSuppressor");
		EntityAI fnx = fn.GetInventory().CreateAttachment("FNP45_MRDSOptic");
		fnx.GetInventory().CreateAttachment("Battery9V");
        ItemBase fx = player.GetInventory().CreateInInventory("Mag_FNX45_15Rnd");
        player.GetInventory().CreateInInventory("Mag_FNX45_15Rnd");
        player.GetInventory().CreateInInventory("Mag_FNX45_15Rnd");
        player.GetInventory().CreateInInventory("Mag_FNX45_15Rnd");
        EntityAI cuchi = player.GetInventory().CreateInInventory("CombatKnife");
	    player.GetInventory().CreateInInventory("TacticalBaconCan_Opened");
        EntityAI NV = player.GetInventory().CreateInInventory("NVGHeadstrap");
	    EntityAI NVB = NV.GetInventory().CreateAttachment("NVGoggles");
	    NVB.GetInventory().CreateAttachment("Battery9V");
	    player.GetInventory().CreateAttachment("Battery9V");



		EntityAI primary;
		
		switch (Math.RandomInt(0, 8)) {
			case 0: primary = assault1Class(player); break;
			case 1: primary = assault2Class(player); break;
			case 2: primary = sniperClass(player); break;
			case 3: primary = smgClass(player); break;
			case 4: primary = sniper1Class(player); break;
			case 5: primary = sniper2Class(player); break;
			case 6: primary = sniper3Class(player); break;
			case 7: primary = shotClass(player); break;
		}
	
		player.LocalTakeEntityToHands(primary);
		player.SetQuickBarEntityShortcut(primary, 0, true);
		player.SetQuickBarEntityShortcut(fn, 1, true);
		player.SetQuickBarEntityShortcut(BUM, 2, true);
		player.SetQuickBarEntityShortcut(BUM2, 3, true);
		player.SetQuickBarEntityShortcut(mor, 4, true);
		player.SetQuickBarEntityShortcut(BUMBUMChao, 5, true);
        player.SetQuickBarEntityShortcut(rags, 6, true);
        player.SetQuickBarEntityShortcut(mega, 7, true);
        player.SetQuickBarEntityShortcut(cuchi, 8, true);
        


	}
};

Mission CreateCustomMission(string path)
{
	return new CustomMission();
}